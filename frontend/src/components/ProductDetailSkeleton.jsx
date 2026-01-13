import React from 'react';

const ProductDetailSkeleton = () => {
  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacing-2xl)'
      }}>
        {/* Back Button Skeleton */}
        <div className="skeleton" style={{
          width: '100px',
          height: '40px',
          borderRadius: 'var(--radius-lg)'
        }} />

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-3xl)'
        }}>
          {/* Image Gallery Skeleton */}
          <div>
            {/* Main Image */}
            <div className="skeleton" style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-2xl)',
              marginBottom: 'var(--spacing-lg)'
            }} />
            
            {/* Thumbnail Row */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)'
                }} />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            {/* Category Badge */}
            <div className="skeleton" style={{
              width: '100px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-md)'
            }} />

            {/* Product Name */}
            <div className="skeleton" style={{
              width: '100%',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)'
            }} />

            {/* Description Lines */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <div className="skeleton" style={{
                width: '100%',
                height: '20px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-sm)'
              }} />
              <div className="skeleton" style={{
                width: '95%',
                height: '20px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--spacing-sm)'
              }} />
              <div className="skeleton" style={{
                width: '85%',
                height: '20px',
                borderRadius: 'var(--radius-sm)'
              }} />
            </div>

            {/* Price Section */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
              <div className="skeleton" style={{
                width: '120px',
                height: '48px',
                borderRadius: 'var(--radius-md)'
              }} />
              <div className="skeleton" style={{
                width: '100px',
                height: '36px',
                borderRadius: 'var(--radius-md)'
              }} />
            </div>

            {/* Quantity Selector Skeleton */}
            <div className="skeleton" style={{
              width: '180px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-xl)'
            }} />

            {/* Button */}
            <div className="skeleton" style={{
              width: '100%',
              height: '56px',
              borderRadius: 'var(--radius-lg)'
            }} />
          </div>
        </div>

        {/* Recommended Products Section */}
        <div style={{ marginTop: 'var(--spacing-3xl)' }}>
          <div className="skeleton" style={{
            width: '250px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }} />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 'var(--radius-xl)',
                  marginBottom: 'var(--spacing-sm)'
                }} />
                <div className="skeleton" style={{
                  width: '80%',
                  height: '20px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-xs)'
                }} />
                <div className="skeleton" style={{
                  width: '50%',
                  height: '24px',
                  borderRadius: 'var(--radius-sm)'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
