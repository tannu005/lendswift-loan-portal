import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import gsap from 'gsap';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the LendSwift AI Assistant. I can help you with loan details, application status, or technical questions about this project. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && chatRef.current) {
      gsap.fromTo(chatRef.current, 
        { y: 50, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    const userMsg = { text: messageText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse = "I'm a simulated AI assistant for this portfolio project! I can tell you that LendSwift uses advanced Open Banking APIs and Machine Learning to process applications instantly. How else can I help?";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('emi') || lowerInput.includes('interest') || lowerInput.includes('rate')) {
        botResponse = "Interest rates start at 10.5% p.a. for Personal Loans. You can use the Loan Simulator panel on the right side of the application to see exact EMI breakdowns!";
      } else if (lowerInput.includes('document') || lowerInput.includes('upload') || lowerInput.includes('pan') || lowerInput.includes('aadhaar')) {
        botResponse = "We use an AI-powered OCR system to extract data from your documents securely. Just upload a clear photo of your PAN or Aadhaar card in Step 6.";
      } else if (lowerInput.includes('fraud') || lowerInput.includes('security') || lowerInput.includes('safe') || lowerInput.includes('encryption')) {
        botResponse = "Security is our top priority. We use 256-bit encryption, Govt E-Stamps, and a multi-layered AI fraud detection model that cross-references identity databases in real time.";
      } else if (lowerInput.includes('eligibility') || lowerInput.includes('qualify') || lowerInput.includes('eligible') || lowerInput.includes('cibil') || lowerInput.includes('credit score')) {
        botResponse = "Eligibility depends on your monthly income, credit score (min 650 recommended), and existing liabilities. Our AI Underwriting engine calculates this in real-time during Step 8!";
      } else if (lowerInput.includes('how long') || lowerInput.includes('time') || lowerInput.includes('fast') || lowerInput.includes('duration')) {
        botResponse = "The entire application process takes less than 3 minutes, and disbursement happens instantly for pre-approved customers.";
      } else if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('call')) {
        botResponse = "You can reach our human support team at support@lendswift.in or call 1800-XXX-XXXX during business hours.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        botResponse = "Hello! How can I assist you with your LendSwift loan application today?";
      } else if (lowerInput.includes('thank')) {
        botResponse = "You're very welcome! Let me know if you need anything else.";
      } else if (lowerInput.includes('payment') || lowerInput.includes('repay') || lowerInput.includes('upi')) {
        botResponse = "You can make payments via UPI, Credit/Debit cards, or Net Banking from your Applicant Dashboard. We also support automated e-NACH mandates!";
      } else if (lowerInput.includes('what is lendswift') || lowerInput.includes('about')) {
        botResponse = "LendSwift is a next-generation digital lending platform. It features instant AI approvals, OCR document scanning, embedded finance APIs, and a completely frictionless UX.";
      } else if (lowerInput.includes('tech stack') || lowerInput.includes('built with') || lowerInput.includes('architecture')) {
        botResponse = "The frontend is built with React and Vite, heavily utilizing GSAP for ultra-smooth animations. The backend architecture simulates Go microservices running on Kubernetes, with PostgreSQL and Redis caching.";
      } else if (lowerInput.includes('resume') || lowerInput.includes('portfolio') || lowerInput.includes('hire')) {
        botResponse = "This project was built to demonstrate enterprise-grade full-stack capabilities, including complex state management, responsive UI/UX, predictive analytics, and mock AI integrations.";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: 'var(--color-primary)',
          color: '#000',
          border: 'none',
          boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '1rem', background: '#020617', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#f8fafc' }}>LendSwift AI</h4>
                <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10b981' }} /> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignSelf: msg.isBot ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                {msg.isBot && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Bot size={14} />
                  </div>
                )}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: msg.isBot ? '#1e293b' : 'var(--color-primary)',
                  color: msg.isBot ? '#e2e8f0' : '#000',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  borderTopLeftRadius: msg.isBot ? '2px' : '12px',
                  borderTopRightRadius: msg.isBot ? '12px' : '2px'
                }}>
                  {msg.text}
                </div>
                {!msg.isBot && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Bot size={14} />
                </div>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  borderTopLeftRadius: '2px',
                  borderTopRightRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'blink 1.4s infinite both' }} />
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'blink 1.4s infinite both 0.2s' }} />
                  <span className="typing-dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%', animation: 'blink 1.4s infinite both 0.4s' }} />
                </div>
              </div>
            )}
            
            <style>{`
              @keyframes blink {
                0% { opacity: 0.2; }
                20% { opacity: 1; }
                100% { opacity: 0.2; }
              }
            `}</style>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length < 3 && !isTyping && (
            <div style={{ padding: '0 1rem 0.75rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexWrap: 'nowrap', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {['Tech Stack?', 'Check Eligibility', 'Security'].map((txt) => (
                <button
                  key={txt}
                  onClick={() => {
                    handleSend(null, txt);
                  }}
                  style={{ whiteSpace: 'nowrap', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                  {txt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#020617', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              style={{ flex: 1, background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '0.5rem 1rem', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
            />
            <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? 'var(--color-primary)' : '#1e293b', color: input.trim() ? '#000' : '#64748b', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              <Send size={16} style={{ marginLeft: '2px' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
