import React from 'react';

const Button = ({ children, onClick, variant = 'primary', loading = false, disabled = false, style, type = 'button', ...props }) => {
  const baseStyle = {
    padding: '14px 32px',
    borderRadius: 'var(--radius-md)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-base)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      background: 'var(--secondary-gradient)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
    },
    accent: {
      background: 'var(--accent-gradient)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid var(--primary-color)',
      color: 'var(--primary-color)',
    },
    ghost: {
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      color: 'var(--primary-color)',
    },
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(-2px)';
      if (variant === 'primary' || variant === 'secondary' || variant === 'accent') {
        e.target.style.boxShadow = 'var(--shadow-lg)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(0)';
      if (variant === 'primary' || variant === 'secondary' || variant === 'accent') {
        e.target.style.boxShadow = 'var(--shadow-md)';
      }
    }
  };

  return (
    <button 
      type={type}
      onClick={disabled || loading ? undefined : onClick} 
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTop: '2px solid white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
