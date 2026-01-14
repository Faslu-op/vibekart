import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategorySection = ({ category, products }) => {
  const scrollContainerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const animationRef = useRef(null);
  const scrollPos = useRef(0);
  const resumeTimeoutRef = useRef(null);

  // Triple products to ensure a perfect, gapless infinite loop
  const displayProducts = [...products, ...products, ...products];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize to the start of the middle set for an immediate infinite feel
    const singleSetWidth = container.scrollWidth / 3;
    if (scrollPos.current === 0) {
      container.scrollLeft = singleSetWidth;
      scrollPos.current = singleSetWidth;
    }

    const scrollSpeed = 0.6; // Controlled, premium slow speed
    
    const animate = () => {
      // "Dont stop the loop" - we keep it moving unless the user is actively swiping/scrolling
      if (!isInteracting) {
        scrollPos.current += scrollSpeed;
        
        // Invisible reset logic
        const currentSingleSetWidth = container.scrollWidth / 3;
        if (scrollPos.current >= currentSingleSetWidth * 2) {
          scrollPos.current -= currentSingleSetWidth;
        }
        
        container.scrollLeft = scrollPos.current;
      } else {
        // Keep our tracking variable synced with user's manual scroll
        scrollPos.current = container.scrollLeft;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isInteracting, products.length]);

  const handleManualInteraction = () => {
    setIsInteracting(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    
    // Smoothly resume auto-scroll after 2.5 seconds of manual inactivity
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2500);
  };

  const scroll = (direction) => {
    handleManualInteraction();
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div 
      style={{
        marginBottom: 'var(--spacing-3xl)',
        animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }}
    >
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-xl)',
        paddingBottom: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            background: 'var(--brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            {category}
          </h2>
          <p style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--text-lighter)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '2px'
          }}>
            Curated Creation
          </p>
        </div>

        {/* Executive Row Navigation */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
          <button
            onClick={() => scroll('left')}
            style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
              background: '#fff', border: '1px solid var(--border-color)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-color)', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-xs)'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
              background: '#fff', border: '1px solid var(--border-color)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-color)', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-xs)'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Infinite Horizontal Row - RIGHT TO LEFT FLOW */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleManualInteraction}
        onTouchStart={handleManualInteraction}
        onWheel={handleManualInteraction}
        style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          overflowX: 'auto',
          paddingBottom: '20px',
          paddingTop: '4px',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isInteracting ? 'grabbing' : 'grab'
        }}
      >
        {displayProducts.map((product, index) => (
          <div 
            key={`${product._id}-${index}`}
            style={{
              flex: '0 0 280px', // Precise width for executive spacing
              minWidth: '280px',
              maxWidth: '280px',
              width: '280px',
              scrollSnapAlign: 'start'
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategorySection;


