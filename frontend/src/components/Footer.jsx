import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--primary-gradient)',
      color: '#fff',
      padding: 'var(--spacing-3xl) 0 var(--spacing-xl)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {/* Subtle Background Decoration */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'var(--brand-gradient)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: 0.08,
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)'
        }}>
          {/* Brand Section */}
          <div style={{ maxWidth: '300px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '900', 
              marginBottom: 'var(--spacing-md)',
              color: '#fff' 
            }}>
              Vibe<span className="brand-text">Kart</span>
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '14px', 
              lineHeight: '1.6',
              fontWeight: '500' 
            }}>
              Elevating your lifestyle with curated executive essentials and handcrafted masterpieces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: 'var(--spacing-lg)', fontSize: '16px', fontWeight: '800' }}>Explore</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: '600', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>New Arrivals</Link>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: '600', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>Executive Decor</Link>
              <Link to="/admin/login" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', fontWeight: '700', marginTop: '8px' }}>Admin Access</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 'var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', fontWeight: '700' }}>
            © {currentYear} VIBEKART EXECUTIVE. ALL RIGHTS RESERVED.
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>
            PREMIUM <span className="brand-text">INDIA</span> EDITION
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
