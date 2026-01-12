import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle both old format (strings) and new format (objects with url)
  const imageList = images.map(img => 
    typeof img === 'string' ? { url: img } : img
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  if (imageList.length === 0) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '1/1',
        backgroundColor: 'var(--background-color)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-light)'
      }}>
        No images available
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Main Image Viewer */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backgroundColor: '#f5f5f7',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <img 
          src={imageList[currentIndex].url} 
          alt={`Product ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            animation: 'fadeIn 0.3s ease'
          }}
        />



        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="touch-target"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition-base)',
                color: 'var(--text-color)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-gradient)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <button
              onClick={handleNext}
              className="touch-target"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition-base)',
                color: 'var(--text-color)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-gradient)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-color)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {imageList.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: '600',
            color: '#fff'
          }}>
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {imageList.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: 'var(--spacing-md)',
          maxWidth: '100%'
        }}>
          {imageList.map((image, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              style={{
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: currentIndex === index ? '3px solid var(--brand-color)' : '3px solid transparent',
                transition: 'var(--transition-base)',
                opacity: currentIndex === index ? 1 : 0.6,
                boxShadow: currentIndex === index ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                transform: currentIndex === index ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== index) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== index) {
                  e.currentTarget.style.opacity = '0.6';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <img 
                src={image.url} 
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
