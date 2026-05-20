import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import { useFormContext } from '../../context/FormContext';
import { LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS, EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER, ACCEPTED_DOC_TYPES, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '../../utils/constants';
import { compressImage, formatFileSize } from '../../utils/imageCompression';

const getRequiredDocs = (loanType, employmentType, panVerified) => {
  const docs = [];
  
  if (!panVerified) {
    docs.push({ key: 'panCardDoc', label: 'PAN Card Copy', accept: ACCEPTED_DOC_TYPES, maxSize: MAX_FILE_SIZE_BYTES, required: true });
  } else {
    docs.push({ key: 'panCardDoc', label: 'PAN Card Copy (Optional - Verified)', accept: ACCEPTED_DOC_TYPES, maxSize: MAX_FILE_SIZE_BYTES, required: false });
  }
  
  docs.push(
    { key: 'aadhaarFrontDoc', label: 'Aadhaar Card (Front)', accept: ACCEPTED_DOC_TYPES, maxSize: MAX_FILE_SIZE_BYTES, required: true },
    { key: 'aadhaarBackDoc', label: 'Aadhaar Card (Back)', accept: ACCEPTED_DOC_TYPES, maxSize: MAX_FILE_SIZE_BYTES, required: true },
  );

  if (employmentType === EMPLOYMENT_SALARIED) {
    docs.push({ key: 'salarySlipsDoc', label: 'Salary Slips (Last 3 months)', accept: ['application/pdf'], maxSize: MAX_FILE_SIZE_BYTES, required: true, multiple: true });
  }

  docs.push({ key: 'bankStatementsDoc', label: 'Bank Statements (Last 6 months)', accept: ['application/pdf'], maxSize: 10 * 1024 * 1024, required: true });

  if (employmentType === EMPLOYMENT_SELF_EMPLOYED || employmentType === EMPLOYMENT_BUSINESS_OWNER) {
    docs.push({ key: 'itrDoc', label: 'ITR (Last 2 years)', accept: ['application/pdf'], maxSize: MAX_FILE_SIZE_BYTES, required: true, multiple: true });
  }

  if (loanType === LOAN_TYPE_HOME) {
    docs.push({ key: 'propertyDoc', label: 'Property Documents', accept: ['application/pdf'], maxSize: 10 * 1024 * 1024, required: true });
  }

  if (loanType === LOAN_TYPE_BUSINESS) {
    docs.push({ key: 'businessRegDoc', label: 'Business Registration Certificate', accept: ['application/pdf'], maxSize: MAX_FILE_SIZE_BYTES, required: true });
    docs.push({ key: 'gstReturnsDoc', label: 'GST Returns (Last 4 quarters)', accept: ['application/pdf'], maxSize: MAX_FILE_SIZE_BYTES, required: true, multiple: true });
  }

  docs.push({ key: 'photographDoc', label: 'Passport Size Photograph', accept: ACCEPTED_IMAGE_TYPES, maxSize: 2 * 1024 * 1024, required: true });

  return docs;
};

function FileUploadField({ doc, files, onFilesChange }) {
  const [compressing, setCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const processedFiles = [];
    
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        setCompressing(true);
        try {
          const result = await compressImage(file);
          processedFiles.push(result.file);
          setCompressionInfo({
            original: formatFileSize(result.originalSize),
            compressed: formatFileSize(result.compressedSize),
            ratio: Math.round((1 - result.compressedSize / result.originalSize) * 100),
          });
        } catch {
          processedFiles.push(file);
        }
        setCompressing(false);
      } else {
        processedFiles.push(file);
      }
    }
    
    onFilesChange(doc.key, processedFiles);
  }, [doc.key, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: doc.accept.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}),
    maxSize: doc.maxSize,
    multiple: doc.multiple || false,
    maxFiles: doc.multiple ? 5 : 1,
  });

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(doc.key, newFiles);
  };

  const hasFiles = files && files.length > 0;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {doc.label} {doc.required && <span className="required">*</span>}
        </label>
        {hasFiles && <span className="badge badge-success">✓ Uploaded</span>}
      </div>

      {!hasFiles && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
          style={{ padding: '1.25rem' }}
          role="button"
          aria-label={`Upload ${doc.label}`}
        >
          <input {...getInputProps()} aria-label={`File input for ${doc.label}`} />
          {compressing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              <span>Compressing image...</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {isDragActive ? 'Drop file here...' : 'Drag & drop or click to upload'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Max {formatFileSize(doc.maxSize)} • {doc.accept.map(t => t.split('/')[1].toUpperCase()).join(', ')}
              </p>
            </>
          )}
        </div>
      )}

      {/* File previews */}
      {hasFiles && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
          {files.map((file, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.75rem', background: 'var(--color-surface-lighter)',
              borderRadius: '0.5rem', fontSize: '0.825rem',
            }}>
              {file.type?.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ) : (
                <span style={{ fontSize: '1.5rem' }}>📄</span>
              )}
              <div>
                <p style={{ fontSize: '0.8rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                  background: 'var(--color-error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {compressionInfo && hasFiles && files[0]?.type?.startsWith('image/') && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '0.25rem' }}>
          🗜️ Compressed: {compressionInfo.original} → {compressionInfo.compressed} ({compressionInfo.ratio}% reduction)
        </p>
      )}
    </div>
  );
}

export default function Step7Documents({ onNext, onPrev }) {
  const { state, updateFormData, setDocuments, setSignature } = useFormContext();
  const sigRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState(state.documents || {});
  const [signatureData, setSignatureData] = useState(state.signature || null);
  const [validationErrors, setValidationErrors] = useState({});

  const loanType = state.formData.loanType;
  const employmentType = state.formData.employmentType;
  const panVerified = state.panVerified;

  const requiredDocs = getRequiredDocs(loanType, employmentType, panVerified);

  const handleFilesChange = useCallback((key, files) => {
    setUploadedFiles(prev => ({ ...prev, [key]: files }));
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearSignature = () => {
    sigRef.current?.clear();
    setSignatureData(null);
    setValidationErrors(prev => ({ ...prev, signature: 'E-signature is required' }));
  };

  const handleSignatureEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const data = sigRef.current.toDataURL('image/png');
      setSignatureData(data);
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next.signature;
        return next;
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Validate required documents
    for (const doc of requiredDocs) {
      if (doc.required && (!uploadedFiles[doc.key] || uploadedFiles[doc.key].length === 0)) {
        errors[doc.key] = `${doc.label} is required`;
      }
    }

    // Validate signature
    if (!signatureData) {
      errors.signature = 'E-signature is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setDocuments(uploadedFiles);
    setSignature(signatureData);
    updateFormData({ signature: signatureData });
    onNext();
  };

  return (
    <form onSubmit={onSubmit} className="animate-fade-in" noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Document Upload & E-Signature
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Upload required documents and provide your digital signature
        </p>
      </div>

      {/* Document checklist */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
          📋 Required Documents
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
          {requiredDocs.map((doc) => (
            <div key={doc.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
              {uploadedFiles[doc.key]?.length > 0 ? (
                <span style={{ color: 'var(--color-accent)' }}>✓</span>
              ) : doc.required ? (
                <span style={{ color: 'var(--color-error)' }}>○</span>
              ) : (
                <span style={{ color: 'var(--color-text-muted)' }}>○</span>
              )}
              <span style={{ color: uploadedFiles[doc.key]?.length > 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                {doc.label}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
            {signatureData ? (
              <span style={{ color: 'var(--color-accent)' }}>✓</span>
            ) : (
              <span style={{ color: 'var(--color-error)' }}>○</span>
            )}
            <span style={{ color: signatureData ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>E-Signature</span>
          </div>
        </div>
      </div>

      {/* File uploads */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {requiredDocs.map((doc) => (
          <div key={doc.key}>
            <FileUploadField
              doc={doc}
              files={uploadedFiles[doc.key] || []}
              onFilesChange={handleFilesChange}
            />
            {validationErrors[doc.key] && (
              <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                {validationErrors[doc.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* E-Signature */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-primary-light)' }}>
          ✍️ E-Signature
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Draw your signature in the box below using mouse or touch
        </p>
        
        <div className="signature-canvas-wrapper" style={{ marginBottom: '0.75rem' }}>
          <SignatureCanvas
            ref={sigRef}
            penColor="#000"
            canvasProps={{
              width: 500,
              height: 200,
              style: { width: '100%', height: '150px', cursor: 'crosshair' },
              'aria-label': 'Signature drawing area',
            }}
            onEnd={handleSignatureEnd}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={clearSignature} className="btn btn-secondary btn-sm">
            Clear Signature
          </button>
        </div>

        {signatureData && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '0.5rem' }}>
            ✓ Signature captured
          </p>
        )}
        {validationErrors.signature && (
          <p role="alert" aria-live="polite" style={{ color: 'var(--color-error)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            {validationErrors.signature}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button type="submit" className="btn btn-primary">
          Continue to Review
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
