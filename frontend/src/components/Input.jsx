import React, { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  error,
  icon,
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: 'var(--spacing-md)', width: '100%', ...style }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: 'var(--spacing-sm)', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: 'var(--text-color)',
          transition: 'var(--transition-base)'
        }}>
          {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? 'var(--primary-color)' : 'var(--text-light)',
            transition: 'var(--transition-base)',
            display: 'flex',
            alignItems: 'center'
          }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: icon ? '14px 16px 14px 48px' : '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${error ? 'var(--danger-color)' : isFocused ? 'var(--primary-color)' : 'var(--border-color)'}`,
            fontSize: '16px',
            fontFamily: 'var(--font-body)',
            transition: 'var(--transition-base)',
            outline: 'none',
            backgroundColor: isFocused ? '#fff' : 'var(--background-color)',
            color: 'var(--text-color)',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p style={{ 
          marginTop: 'var(--spacing-xs)', 
          fontSize: '13px', 
          color: 'var(--danger-color)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
