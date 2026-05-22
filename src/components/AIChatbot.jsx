import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import gsap from 'gsap';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the LendSwift AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
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

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse = "I'm a simulated AI assistant for this portfolio project! I can tell you that LendSwift uses advanced Open Banking APIs and Machine Learning to process applications instantly.";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('emi') || lowerInput.includes('interest')) {
        botResponse = "Interest rates start at 10.5% p.a. for Personal Loans. You can use the Loan Simulator panel on the right side of the application to see exact EMI breakdowns!";
      } else if (lowerInput.includes('document') || lowerInput.includes('upload')) {
        botResponse = "We use an AI-powered OCR system to extract data from your documents securely. Just upload a clear photo of your PAN or Aadhaar card.";
      } else if (lowerInput.includes('fraud') || lowerInput.includes('security')) {
        botResponse = "Security is our top priority. We use 256-bit encryption and a multi-layered AI fraud detection model that cross-references identity databases in real time.";
      }

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 1000);
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
            <div ref={messagesEndRef} />
          </div>

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
