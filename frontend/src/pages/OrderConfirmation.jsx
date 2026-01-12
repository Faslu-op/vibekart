import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    // Optional: Add confetti animation timeout
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-gradient)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--spacing-xl) 0'
      }}>
        {/* Abstract Brand Shapes */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'var(--brand-gradient)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.2,
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '5%',
          left: '-5%',
          width: '250px',
          height: '250px',
          background: 'var(--brand-color)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          animation: 'pulse 6s ease-in-out infinite'
        }} />

        <div className="container" style={{ 
          padding: 'var(--spacing-xl) var(--spacing-md)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="glass" style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: 'var(--spacing-3xl) var(--spacing-xl)',
            borderRadius: 'var(--radius-2xl)',
            maxWidth: '550px',
            margin: '0 auto',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {/* Success Icon Block */}
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto var(--spacing-xl)',
              background: 'var(--brand-color)',
              borderRadius: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(10deg)',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards',
              opacity: 0,
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)'
            }}>
              <CheckCircle 
                size={50} 
                color="#fff" 
                strokeWidth={3}
              />
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 8vw, 3rem)',
              fontWeight: '900',
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--text-color)',
              letterSpacing: '-0.04em',
              lineHeight: '1.1',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
              opacity: 0
            }}>
              Order <span className="brand-text">Confirmed</span>
            </h1>

            <p style={{
              fontSize: '17px',
              color: 'var(--text-light)',
              marginBottom: 'var(--spacing-xl)',
              lineHeight: '1.6',
              fontWeight: '600',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards',
              opacity: 0
            }}>
              Welcome to the VibeKart family. Your executive collection is being prepared.
            </p>

            {/* Premium Trust Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: 'var(--spacing-2xl)',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
              opacity: 0
            }}>
              {[
                { icon: '🛡️', label: 'Secure', sub: 'Verified' },
                { icon: '💎', label: 'Premium', sub: 'Quality' },
                { icon: '💬', label: '24/7', sub: 'Support' }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '16px 8px',
                  background: 'var(--background-color)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  transition: 'var(--transition-base)'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-color)', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-lighter)', fontWeight: '700' }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              padding: 'var(--spacing-lg)',
              background: 'rgba(124, 58, 237, 0.05)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: 'var(--spacing-2xl)',
              fontSize: '14px',
              color: 'var(--brand-color)',
              fontWeight: '700',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards',
              opacity: 0
            }}>
              ✅ Your executive order has been placed successfully and will reach you shortly.
            </div>

            <Link to="/" style={{
              animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.7s forwards',
              opacity: 0,
              display: 'block',
              textDecoration: 'none'
            }}>
              <Button 
                style={{
                  width: '100%',
                  padding: '18px 0',
                  fontSize: '15px',
                  fontWeight: '900',
                  background: 'var(--brand-gradient)',
                  boxShadow: '0 8px 30px rgba(124, 58, 237, 0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
