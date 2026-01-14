import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { optimizeCloudinaryImage } from '../utils/imageOptimization';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle both old format (images as strings) and new format (images as objects)
  const rawImageUrl = product.images?.[0]?.url || product.images?.[0] || '';
  
  // Optimize image for card display (smaller, auto format/quality)
  const imageUrl = optimizeCloudinaryImage(rawImageUrl, {
    width: 400,  // Cards are max 300px, so 400px is good for retina
    quality: 'auto:good',
    format: 'auto'
  });

  return (
    <Link 
      to={`/product/${product._id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        backgroundColor: 'var(--card-background)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'var(--transition-base)',
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid var(--border-color)'
      }}>
        {/* Image Container */}
        <div style={{
          width: '100%',
          height: '280px', // Explicit fixed height
          minHeight: '280px',
          maxHeight: '280px',
          aspectRatio: '1/1',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          position: 'relative'
        }}>
          <img 
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '280px',
              maxHeight: '280px',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'var(--transition-slow)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              display: 'block'
            }}
          />
          
          {/* Category Badge */}
          {product.category && (
            <div className="glass" style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--text-color)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              zIndex: 2
            }}>
              {product.category}
            </div>
          )}

          {/* Offer Badge */}
          {product.originalPrice > product.sellingPrice && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '900',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              zIndex: 2,
              animation: 'fadeIn 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: 'var(--spacing-xl)'
        }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: '700',
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--text-color)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.3px'
          }}>
            {product.name}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {/* Actual Price */}
              <p style={{
                fontSize: '14px',
                color: 'var(--text-lighter)',
                textDecoration: 'line-through',
                fontWeight: '500'
              }}>
                ₹{(product.originalPrice || 0).toLocaleString('en-IN')}
              </p>
              
              {/* Offer Price */}
              <p style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-color)',
                lineHeight: '1'
              }}>
                ₹{(product.sellingPrice || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: isHovered ? 'var(--brand-gradient)' : 'var(--background-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-base)',
              color: isHovered ? '#fff' : 'var(--text-color)',
              boxShadow: isHovered ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
