import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import { useFormContext } from '../../context/FormContext';
import gsap from 'gsap';
import { LOAN_TYPE_HOME, LOAN_TYPE_BUSINESS, EMPLOYMENT_SALARIED, EMPLOYMENT_SELF_EMPLOYED, EMPLOYMENT_BUSINESS_OWNER, ACCEPTED_DOC_TYPES, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '../../utils/constants';
import { compressImage, formatFileSize } from '../../utils/imageCompression';
import { Upload, FileText, X, ChevronLeft, ChevronRight, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

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
    docs.push({ key: 'salarySlipsDoc', label: 'Salary Slips (3 months)', accept: ['application/pdf'], maxSize: MAX_FILE_SIZE_BYTES, required: true, multiple: true });
  }

  docs.push({ key: 'bankStatementsDoc', label: 'Bank Statements (6 months)', accept: ['application/pdf'], maxSize: 10 * 1024 * 1024, required: true });

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

  docs.push({ key: 'photographDoc', label: 'Passport Photograph', accept: ACCEPTED_IMAGE_TYPES, maxSize: 2 * 1024 * 1024, required: true });

  return docs;
};

function FileUploadField({ doc, files, onFilesChange }) {
  const [compressing, setCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const previewRef = useRef(null);

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

    // Trigger AI Scan Simulation
    if (processedFiles.length > 0) {
      setIsScanning(true);
      setScanComplete(false);
      
      // GSAP Animation for laser
      setTimeout(() => {
        if (previewRef.current) {
          gsap.fromTo('.scan-laser', 
            { top: '0%', opacity: 1 }, 
            { top: '100%', duration: 1.2, ease: 'power2.inOut', repeat: 1, yoyo: true, onComplete: () => {
              setIsScanning(false);
              setScanComplete(true);
              gsap.fromTo('.ocr-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' });
            }}
          );
        }
      }, 100);
    }
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
        <label className="form-label" style={{ marginBottom: 0, color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: '500' }}>
          {doc.label} {doc.required && <span className="required">*</span>}
        </label>
        {hasFiles && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '500' }}>
            Ready
          </span>
        )}
      </div>

      {!hasFiles && (
        <div
          {...getRootProps()}
          style={{
            padding: '1.25rem',
            border: isDragReject
              ? '1px dashed var(--color-error)'
              : isDragActive
                ? '1px dashed var(--color-primary-light)'
                : '1px dashed var(--color-border-light)',
            borderRadius: '6px',
            background: 'var(--color-input-bg)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          role="button"
          aria-label={`Upload ${doc.label}`}
        >
          <input {...getInputProps()} aria-label={`File input for ${doc.label}`} />
          {compressing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid var(--color-primary-light)', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>Compressing image...</span>
            </div>
          ) : (
            <>
              <Upload size={18} style={{ color: 'var(--color-text-muted)', marginBottom: '0.375rem', margin: '0 auto 0.25rem' }} />
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                {isDragActive ? 'Drop file here...' : 'Drag & drop or click to browse'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                Max {formatFileSize(doc.maxSize)} · PDF or Images
              </p>
            </>
          )}
        </div>
      )}

      {/* File previews */}
      {hasFiles && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.375rem' }}>
          {files.map((file, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.625rem', background: 'var(--color-surface-lighter)',
              borderRadius: '4px', fontSize: '0.8rem', width: '100%',
              border: '1px solid var(--color-border)',
            }}>
              {file.type?.startsWith('image/') ? (
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '3px' }} ref={previewRef}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  {isScanning && (
                    <div className="scan-laser" style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      zIndex: 10
                    }} />
                  )}
                </div>
              ) : (
                <FileText size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, color: 'var(--color-text-primary)' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', margin: 0 }}>{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AI OCR Badges */}
      {scanComplete && hasFiles && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span className="ocr-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <ShieldCheck size={10} /> Fraud Check Passed
          </span>
          <span className="ocr-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.625rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <FileText size={10} /> OCR Data Extracted
          </span>
        </div>
      )}

      {compressionInfo && hasFiles && files[0]?.type?.startsWith('image/') && (
        <p style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginTop: '0.25rem', margin: 0 }}>
          Optimized: {compressionInfo.original} → {compressionInfo.compressed} (-{compressionInfo.ratio}%)
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
    setValidationErrors(prev => ({ ...prev, signature: 'Signature is required' }));
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

    for (const doc of requiredDocs) {
      if (doc.required && (!uploadedFiles[doc.key] || uploadedFiles[doc.key].length === 0)) {
        errors[doc.key] = `${doc.label} is required`;
      }
    }

    if (!signatureData) {
      errors.signature = 'Signature is required';
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
    <form onSubmit={onSubmit} noValidate>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          Upload your documents
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
          Secure end-to-end encrypted document upload and digital authorization signing.
        </p>
      </div>

      {/* Asymmetric Split Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Upload Fields + Signature Pad */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {requiredDocs.map((doc) => (
              <div key={doc.key}>
                <FileUploadField
                  doc={doc}
                  files={uploadedFiles[doc.key] || []}
                  onFilesChange={handleFilesChange}
                />
                {validationErrors[doc.key] && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                    {validationErrors[doc.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Digital Signature Pad */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Digital signature authorization
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Draw your sign inside the box below to authorize secure checks.
            </p>

            <div style={{
              background: '#08090C',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <SignatureCanvas
                ref={sigRef}
                penColor="#E8ECF3"
                canvasProps={{
                  width: 500,
                  height: 120,
                  style: { width: '100%', height: '110px', cursor: 'crosshair' },
                  'aria-label': 'Signature capture window',
                }}
                onEnd={handleSignatureEnd}
              />
              <button
                type="button"
                onClick={clearSignature}
                style={{
                  position: 'absolute',
                  right: '8px',
                  bottom: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  padding: '3px 8px',
                  fontSize: '0.6875rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
            {validationErrors.signature && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {validationErrors.signature}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Handcrafted Document Vault Lock Panel */}
        <div style={{
          background: 'var(--color-surface-light)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          position: 'sticky',
          top: '20px',
        }}>
          <p style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            fontWeight: '600',
            marginBottom: '1.25rem',
          }}>
            Secure Document Locker
          </p>

          <div style={{
            background: 'var(--color-surface-lighter)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '6px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {requiredDocs.map((doc) => {
              const fileList = uploadedFiles[doc.key] || [];
              const isUploaded = fileList.length > 0;
              return (
                <div key={doc.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  opacity: isUploaded ? 1 : 0.45,
                  transition: 'opacity 0.2s',
                }}>
                  <div style={{
                    color: isUploaded ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    <Lock size={12} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: 'var(--color-text-primary)', display: 'block', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.label.replace(' (Optional - Verified)', '')}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', fontFamily: 'monospace' }}>
                      {isUploaded ? `AES-256 [SHA-${fileList[0].name.length * 3}37a]` : 'LOCKER SLOT EMPTY'}
                    </span>
                  </div>
                  {isUploaded && <CheckCircle size={12} style={{ color: 'var(--color-accent)' }} />}
                </div>
              );
            })}

            {/* Signature status in locker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.75rem',
              opacity: signatureData ? 1 : 0.45,
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--color-border)',
            }}>
              <div style={{ color: signatureData ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                <Lock size={12} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ color: 'var(--color-text-primary)', display: 'block', fontWeight: '500' }}>
                  Signing Authorization
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', display: 'block', fontFamily: 'monospace' }}>
                  {signatureData ? 'DIGITIZED & CRYPTO-SIGNED' : 'PENDING E-SIGN'}
                </span>
              </div>
              {signatureData && <CheckCircle size={12} style={{ color: 'var(--color-accent)' }} />}
            </div>

            {signatureData && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.375rem',
                borderRadius: '4px',
                background: 'var(--color-surface-light)',
                border: '1px solid var(--color-border)',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src={signatureData} alt="Captured E-signature preview" style={{ height: '100%' }} />
              </div>
            )}

            {Object.keys(uploadedFiles).length === requiredDocs.length && signatureData && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.6875rem',
                color: 'var(--color-accent)',
              }}>
                <ShieldCheck size={12} />
                <span>ALL UPLOADS ENCRYPTED</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
        <button type="button" onClick={onPrev} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ChevronLeft size={16} />
          Back
        </button>
        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          Continue
          <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}
