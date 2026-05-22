import { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { LOAN_CONFIGS } from '../utils/constants';
import { formatIndianCurrency } from '../utils/validators';
import { calculateEMI, getInterestRate } from '../utils/emiCalculator';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Phone, 
  Mail, 
  ArrowRight, 
  Sliders,
  RotateCcw,
  ExternalLink,
  CreditCard,
  Award,
  TrendingUp,
  Wallet,
  Smartphone,
  Check
} from 'lucide-react';

const STATUSES = {
  submitted: {
    label: 'Submitted',
    color: 'var(--color-primary-light)',
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.2)',
    icon: Clock,
    title: 'Application received',
    description: 'We have received your application. The automated risk assessment has started and is verifying your identity credentials against CIBIL and credit bureau databases.',
  },
  under_review: {
    label: 'Under Review',
    color: 'var(--color-warning)',
    bg: 'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.2)',
    icon: Clock,
    title: 'Manual evaluation in progress',
    description: 'Automated verification check passed. A senior lending officer is currently checking your uploaded salary slips and bank statements for final income underwriting.',
  },
  approved: {
    label: 'Approved',
    color: 'var(--color-accent)',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
    icon: CheckCircle,
    title: 'Loan approved & offer ready',
    description: 'Congratulations! Your loan has been approved. The key terms are outlined below. Please accept the loan agreement below to initiate instant bank disbursement.',
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--color-error)',
    bg: 'rgba(251, 113, 133, 0.08)',
    border: 'rgba(251, 113, 133, 0.2)',
    icon: XCircle,
    title: 'Application declined',
    description: 'After reviewing your credit history and debt-to-income ratio, we are unable to approve your application at this time. You can re-apply in 30 days or contact our grievance desk.',
  },
};

export default function ApplicantDashboard() {
  const { state, resetForm } = useFormContext();
  const [currentStatus, setCurrentStatus] = useState('submitted');
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [disbursing, setDisbursing] = useState(false);
  const [disbursed, setDisbursed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [autoDebit, setAutoDebit] = useState(false);
  const [points, setPoints] = useState(450);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fd = state.formData;
  const config = LOAN_CONFIGS[fd.loanType || 'personal'];
  const interestRate = getInterestRate(fd.loanType || 'personal');
  const emiResult = calculateEMI(fd.loanAmount || 100000, interestRate, fd.loanTenure || 12);
  const statusInfo = STATUSES[currentStatus];

  const handleAcceptAgreement = async () => {
    setDisbursing(true);
    // Simulate disbursal delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    setDisbursing(false);
    setDisbursed(true);
  };

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      setPoints(prev => prev + 50); // Gamification boost
    }, 2000);
  };

  const steps = [
    { key: 'draft', label: 'Application Drafted', time: 'Completed' },
    { key: 'submitted', label: 'Signed & Submitted', time: 'Completed' },
    { 
      key: 'assessment', 
      label: 'Credit Check & KYC', 
      status: currentStatus === 'submitted' ? 'active' : 'completed',
      time: currentStatus === 'submitted' ? 'In progress' : 'Passed' 
    },
    { 
      key: 'review', 
      label: 'Lender Manual Review', 
      status: currentStatus === 'submitted' ? 'pending' : currentStatus === 'under_review' ? 'active' : currentStatus === 'rejected' ? 'failed' : 'completed',
      time: currentStatus === 'submitted' ? 'Awaiting step' : currentStatus === 'under_review' ? 'In progress' : currentStatus === 'rejected' ? 'Declined' : 'Passed' 
    },
    { 
      key: 'disbursal', 
      label: 'Funds Disbursed', 
      status: currentStatus === 'approved' ? (disbursed ? 'completed' : 'active') : 'pending',
      time: disbursed ? 'Transferred' : currentStatus === 'approved' ? 'Pending signature' : 'Awaiting approval' 
    },
  ];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Simulation Banner - Quiet and Technical */}
      <div style={{
        background: 'var(--color-surface-lighter)',
        border: '1px solid var(--color-border-light)',
        borderRadius: '8px',
        padding: '0.875rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={16} style={{ color: 'var(--color-text-secondary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-secondary)' }}>
            Reviewer Simulator
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            (Simulate status updates for testing)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {Object.keys(STATUSES).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => {
                setCurrentStatus(statusKey);
                if (statusKey !== 'approved') {
                  setAgreementAccepted(false);
                  setDisbursed(false);
                }
              }}
              style={{
                background: currentStatus === statusKey ? 'rgba(99, 102, 241, 0.12)' : 'var(--color-surface)',
                border: `1px solid ${currentStatus === statusKey ? 'var(--color-primary-light)' : 'var(--color-border)'}`,
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: currentStatus === statusKey ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {STATUSES[statusKey].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem' }} className="hide-mobile-grid">
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status Header Block */}
          <div className="card" style={{ padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <span style={{
                background: statusInfo.bg,
                border: `1px solid ${statusInfo.border}`,
                color: statusInfo.color,
                padding: '0.25rem 0.625rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}>
                <statusInfo.icon size={13} />
                {statusInfo.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Application ID: {(state.applicationId || 'LS-84920').substring(0, 8).toUpperCase()}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
              {statusInfo.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {statusInfo.description}
            </p>

            {/* Approved offer card */}
            {currentStatus === 'approved' && !disbursed && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                background: 'var(--color-surface-lighter)',
                borderRadius: '6px',
                border: '1px solid var(--color-border-light)',
              }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Approved Loan Agreement
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Amount</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{formatIndianCurrency(fd.loanAmount || 100000)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Interest Rate</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: 'var(--color-accent)' }}>{interestRate}% p.a.</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tenure</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{fd.loanTenure || 12} months</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Monthly EMI</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{formatIndianCurrency(emiResult.emi)}</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={agreementAccepted}
                      onChange={(e) => setAgreementAccepted(e.target.checked)}
                      style={{ marginTop: '0.125rem', width: '16px', height: '16px', accentColor: 'var(--color-primary-light)' }}
                    />
                    <span style={{ fontSize: '0.75rem', lineHeight: '1.5', color: 'var(--color-text-secondary)' }}>
                      I agree to the loan terms and conditions and authorize electronic disbursement of the funds to my registered bank account.
                    </span>
                  </label>

                  <button
                    onClick={handleAcceptAgreement}
                    disabled={!agreementAccepted || disbursing}
                    className="btn btn-accent"
                    style={{ width: '100%', minHeight: '38px' }}
                  >
                    {disbursing ? (
                      <>
                        <span className="animate-spin" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
                        Processing transfer...
                      </>
                    ) : (
                      <>
                        Accept & Sign Agreement
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Funds Disbursed success block */}
            {disbursed && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                background: 'rgba(16, 185, 129, 0.04)',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                textAlign: 'center',
              }}>
                <CheckCircle size={32} style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  Funds successfully disbursed
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', maxWidth: '380px', margin: '0 auto 1rem', lineHeight: '1.5' }}>
                  The amount of {formatIndianCurrency(fd.loanAmount || 100000)} has been sent via IMPS to your bank account.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary btn-sm" style={{ gap: '0.25rem' }}>
                    <FileText size={12} />
                    Disbursement Receipt
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Loan details summary block */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Loan details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Loan product</span>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.125rem 0 0' }}>{config?.label || 'Personal Loan'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Borrower name</span>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.125rem 0 0' }}>{fd.fullName || '—'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>EMI amount</span>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.125rem 0 0' }}>{formatIndianCurrency(emiResult.emi)} / month</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Purpose</span>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0.125rem 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{fd.loanPurpose || '—'}</p>
              </div>
            </div>
          </div>

          {/* Pending checklist */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Application Checklist
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flex: 1 }}>Identity verification (PAN / Aadhaar)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flex: 1 }}>Income documentation upload</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flex: 1 }}>Electronic signature</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Signed</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--color-surface)',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
              }}>
                {currentStatus === 'approved' ? (
                  disbursed ? (
                    <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: 'var(--color-warning)' }} />
                  )
                ) : currentStatus === 'rejected' ? (
                  <XCircle size={16} style={{ color: 'var(--color-error)' }} />
                ) : (
                  <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
                )}
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flex: 1 }}>
                  {currentStatus === 'approved' ? 'Sign loan agreement' : currentStatus === 'rejected' ? 'Application review declined' : 'Automated risk evaluation'}
                </span>
                <span style={{ fontSize: '0.75rem', color: currentStatus === 'approved' && !disbursed ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                  {disbursed ? 'Completed' : currentStatus === 'approved' ? 'Action required' : currentStatus === 'rejected' ? 'Declined' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Repayment & Gamification Hub (V2 Feature) */}
          {disbursed && (
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.25rem 0' }}>
                    <Wallet size={18} color="#10b981" /> Repayment Hub
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Manage your active loan & rewards</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.375rem 0.75rem', borderRadius: '100px' }}>
                  <Award size={14} color="#fbbf24" />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fbbf24' }}>{points} Loyalty Pts</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming EMI</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary)', marginTop: '0.125rem' }}>{formatIndianCurrency(emiResult.emi)}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Due on 5th of next month</span>
                  </div>
                  <button onClick={() => setShowPaymentModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Pay Now
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)', display: 'block' }}>e-NACH Auto-Debit</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Automatically pay from verified bank</span>
                  </div>
                  <button onClick={() => setAutoDebit(!autoDebit)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '22px', background: autoDebit ? '#10b981' : '#334155', borderRadius: '11px', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: autoDebit ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </button>
                </div>
                
                <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <TrendingUp size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
                   <span style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                     <strong style={{ color: '#3b82f6' }}>Credit Boost Simulator:</strong> Paying your EMI on time will simulate a +12 point boost to your Experian score next month.
                   </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Timeline & Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Timeline rail */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
              {/* Vertical connecting line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                background: 'var(--color-border)',
                zIndex: 1,
              }} />

              {steps.map((step, index) => {
                const isCompleted = step.status === 'completed' || step.time === 'Completed' || step.time === 'Passed' || step.time === 'Transferred';
                const isActive = step.status === 'active';
                const isFailed = step.status === 'failed';

                let dotColor = 'var(--color-border)';
                let dotBorder = 'var(--color-border)';
                let labelColor = 'var(--color-text-muted)';
                let timeColor = 'var(--color-text-muted)';

                if (isCompleted) {
                  dotColor = 'var(--color-accent)';
                  dotBorder = 'var(--color-accent)';
                  labelColor = 'var(--color-text-primary)';
                  timeColor = 'var(--color-accent)';
                } else if (isActive) {
                  dotColor = 'var(--color-primary)';
                  dotBorder = 'var(--color-primary-light)';
                  labelColor = 'var(--color-text-primary)';
                  timeColor = 'var(--color-primary-light)';
                } else if (isFailed) {
                  dotColor = 'var(--color-error)';
                  dotBorder = 'var(--color-error)';
                  labelColor = 'var(--color-text-secondary)';
                  timeColor = 'var(--color-error)';
                }

                return (
                  <div key={index} style={{ display: 'flex', gap: '0.875rem', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: dotColor,
                      border: `2px solid ${dotBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.5rem',
                      color: 'white',
                      flexShrink: 0,
                      marginTop: '2px',
                      boxShadow: isActive ? '0 0 0 4px rgba(99, 102, 241, 0.15)' : 'none',
                    }}>
                      {isCompleted && '✓'}
                      {isFailed && '✕'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: isActive || isCompleted ? '600' : '400', color: labelColor }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: timeColor, marginTop: '1px' }}>
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support widget */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: '0.875rem' }}>
              Support Center
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: '1rem', marginTop: 0 }}>
              If you have any questions regarding your evaluation or interest rates, contact our underwriting help desk.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a 
                href="mailto:support@lendswift.in" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontSize: '0.75rem', 
                  color: 'var(--color-text-secondary)', 
                  textDecoration: 'none',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <Mail size={12} style={{ color: 'var(--color-text-muted)' }} />
                support@lendswift.in
              </a>
              <a 
                href="tel:18001234567" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontSize: '0.75rem', 
                  color: 'var(--color-text-secondary)', 
                  textDecoration: 'none',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <Phone size={12} style={{ color: 'var(--color-text-muted)' }} />
                1800-XXX-XXXX
              </a>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1rem', paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6875rem', color: 'var(--color-primary-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                RBI Ombudsman Portal
                <ExternalLink size={10} />
              </a>
              <button 
                onClick={resetForm}
                style={{ 
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.6875rem', 
                  color: 'var(--color-error)', 
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginTop: '0.25rem',
                }}
              >
                <RotateCcw size={10} />
                Reset simulator & start new app
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Stack fallback */}
      <div className="show-mobile" style={{ display: 'none', flexDirection: 'column', gap: '1.25rem' }}>
        {/* We add basic flex elements that mimic the main layout, responsive styling in index.css will hide/show appropriately */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ background: statusInfo.bg, border: `1px solid ${statusInfo.border}`, color: statusInfo.color, padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
              {statusInfo.label}
            </span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem' }}>{statusInfo.title}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>{statusInfo.description}</p>
        </div>
      </div>

      {/* Payment Simulator Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in card" style={{ padding: '2rem', maxWidth: '400px', width: '90%', background: '#0f172a', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Complete Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={20} /></button>
            </div>
            
            {paymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ display: 'inline-flex', background: '#10b981', color: '#fff', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#10b981', margin: '0 0 0.5rem 0' }}>Payment Successful!</h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>+50 Loyalty Points earned.</p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>
                  {formatIndianCurrency(emiResult.emi)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={handleSimulatePayment} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1rem', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}>
                    <Smartphone size={20} color="#38bdf8" /> Pay via UPI (PhonePe / GPay)
                  </button>
                  <button onClick={handleSimulatePayment} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1rem', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}>
                    <CreditCard size={20} color="#f43f5e" /> Credit / Debit Card
                  </button>
                  <button onClick={handleSimulatePayment} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1rem', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}>
                    <Wallet size={20} color="#fbbf24" /> Net Banking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
