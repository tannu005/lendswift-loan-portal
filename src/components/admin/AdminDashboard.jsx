import { useState, useEffect } from 'react';
import { ArrowLeft, Users, CreditCard, ShieldAlert, BarChart3, ShieldCheck, Lock, Activity } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/validators';

const DUMMY_APPLICATIONS = [
  { id: 'APP-9982', name: 'Rahul Sharma', type: 'Personal', amount: 500000, riskScore: 780, status: 'Approved', date: '2m ago' },
  { id: 'APP-9981', name: 'Priya Patel', type: 'Home', amount: 4500000, riskScore: 710, status: 'Review', date: '15m ago', fraudFlag: 'Mismatched IP' },
  { id: 'APP-9980', name: 'Amit Kumar', type: 'Business', amount: 1200000, riskScore: 580, status: 'Rejected', date: '1h ago' },
  { id: 'APP-9979', name: 'Sneha Gupta', type: 'Personal', amount: 200000, riskScore: 820, status: 'Approved', date: '2h ago' },
  { id: 'APP-9978', name: 'Vikram Singh', type: 'Home', amount: 8000000, riskScore: 690, status: 'Review', date: '3h ago', fraudFlag: 'Fake PAN Detected' },
];

export default function AdminDashboard({ onBack }) {
  const [role, setRole] = useState('underwriter'); // underwriter | admin
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Approved') return '#10b981';
    if (status === 'Rejected') return '#ef4444';
    return '#fbbf24';
  };

  const getRiskColor = (score) => {
    if (score >= 750) return '#10b981';
    if (score >= 650) return '#fbbf24';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
        <Activity className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#020305', // Deep dark background for admin
      color: '#e2e8f0',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid #334155' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>LendSwift Underwriter OS</h1>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={12} /> System Secure
            </span>
          </div>
        </div>

        {/* RBAC Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', padding: '0.25rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <button 
            onClick={() => setRole('underwriter')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              fontSize: '0.875rem',
              background: role === 'underwriter' ? '#3b82f6' : 'transparent',
              color: role === 'underwriter' ? '#fff' : '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            L1 Underwriter
          </button>
          <button 
            onClick={() => setRole('admin')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              fontSize: '0.875rem',
              background: role === 'admin' ? '#ef4444' : 'transparent',
              color: role === 'admin' ? '#fff' : '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={14} /> Super Admin
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Total Disbursed (MTD)</span>
            <CreditCard size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{formatIndianCurrency(142500000)}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>+12.5% from last month</div>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Auto-Approval Rate</span>
            <BarChart3 size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>68.4%</div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>-2.1% from last month</div>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>High Risk Flagged</span>
            <ShieldAlert size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>142</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Pending manual review</div>
        </div>

        {role === 'admin' && (
           <div style={{ background: '#022c22', border: '1px solid #064e3b', padding: '1.5rem', borderRadius: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6ee7b7', marginBottom: '1rem' }}>
               <span style={{ fontSize: '0.875rem' }}>Bank Settlements (Auto-Reconciled)</span>
               <Activity size={18} />
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>99.8%</div>
             <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.5rem' }}>Only 2 orphans required manual matching</div>
           </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: role === 'admin' ? '2fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Applications Queue */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Live Application Queue</h2>
            <span style={{ background: '#1e293b', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem' }}>Updating real-time</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#020617', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>App ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>Applicant</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>AI Risk Score</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_APPLICATIONS.map((app, i) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #1e293b', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#94a3b8' }}>{app.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {app.name}
                      {app.fraudFlag && (
                        <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.625rem', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldAlert size={10} /> AI Flag: {app.fraudFlag}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{app.type} Loan • {app.date}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{formatIndianCurrency(app.amount)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: `${getRiskColor(app.riskScore)}20`, 
                      color: getRiskColor(app.riskScore),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {app.riskScore}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: getStatusColor(app.status), fontSize: '0.875rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(app.status) }} />
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Super Admin Privileged Panel */}
        {role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#ef4444" />
                Compliance & Audit Log
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>[09:42:12] SYSTEM</span>
                  <span style={{ color: '#10b981' }}>KAFKA QUEUE SYNCED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>[09:40:05] ADMIN_04</span>
                  <span style={{ color: '#fbbf24' }}>MODIFIED RULE ENGINE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>[09:35:22] SYSTEM</span>
                  <span style={{ color: '#10b981' }}>S3 BACKUP COMPLETE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>[09:15:00] WEBHOOK</span>
                  <span style={{ color: '#ef4444' }}>EQUIFAX TIMEOUT RETRY 1</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
               <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={18} color="#3b82f6" />
                Infrastructure Health
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: '#94a3b8' }}>
                    <span>K8s Cluster Load</span>
                    <span>42%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px' }}>
                    <div style={{ width: '42%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: '#94a3b8' }}>
                    <span>PostgreSQL Replicas</span>
                    <span>Healthy (3/3)</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Analytics Panel */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem' }}>
               <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="#f59e0b" />
                Default Risk Prediction (ML Model)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>Predicted NPA Rate (Q3)</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>Based on macro-economic indicators</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>2.1%</div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Risk Distribution by Cohort</div>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', background: '#10b981' }} title="Low Risk (65%)" />
                    <div style={{ width: '25%', background: '#fbbf24' }} title="Medium Risk (25%)" />
                    <div style={{ width: '10%', background: '#ef4444' }} title="High Risk (10%)" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#64748b', marginTop: '0.5rem' }}>
                    <span>Low</span>
                    <span>Med</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
