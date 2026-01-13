import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      {/* Image Skeleton */}
      <div className="skeleton" style={{
        width: '100%',
        aspectRatio: '1/1',
        backgroundColor: '#f0f0f0'
      }} />
      
      {/* Content Skeleton */}
      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* Category Badge Skeleton */}
        <div className="skeleton" style={{
          width: '80px',
          height: '20px',
          borderRadius: 'var(--radius-full)',
          marginBottom: 'var(--spacing-sm)',
          backgroundColor: '#f0f0f0'
        }} />
        
        {/* Title Skeleton */}
        <div className="skeleton" style={{
          width: '100%',
          height: '24px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-sm)',
          backgroundColor: '#f0f0f0'
        }} />
        
        {/* Description Skeleton */}
        <div className="skeleton" style={{
          width: '90%',
          height: '16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-md)',
          backgroundColor: '#f0f0f0'
        }} />
        
        {/* Price Skeleton */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <div className="skeleton" style={{
            width: '80px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#f0f0f0'
          }} />
          <div className="skeleton" style={{
            width: '60px',
            height: '20px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#f0f0f0'
          }} />
        </div>
        
        {/* Button Skeleton */}
        <div className="skeleton" style={{
          width: '100%',
          height: '44px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#f0f0f0'
        }} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
