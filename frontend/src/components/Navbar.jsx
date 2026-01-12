import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: scrolled 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: scrolled 
        ? '1px solid var(--border-color)' 
        : '1px solid transparent',
      transition: 'var(--transition-base)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            fontSize: '22px',
            fontWeight: '800',
            color: 'var(--text-color)',
            textDecoration: 'none',
            letterSpacing: '-0.5px'
          }}
        >
          <img 
            src="/favicon.png" 
            alt="VibeKart" 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'contain'
            }} 
          />
          VibeKart
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center'
        }}>
          <Link 
            to="/" 
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: location.pathname === '/' ? 'var(--brand-color)' : 'var(--text-color)',
              textDecoration: 'none',
              transition: 'var(--transition-base)',
              position: 'relative',
              padding: '8px 0'
            }}
          >
            Home
            {location.pathname === '/' && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '0',
                right: '0',
                height: '3px',
                background: 'var(--brand-gradient)',
                borderRadius: 'var(--radius-full)'
              }} />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
