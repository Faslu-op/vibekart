import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProducts } from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import ImageGallery from '../components/ImageGallery';
import ProductCard from '../components/ProductCard';
import { Minus, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProduct(id);
      setProduct(data);
      
      // Fetch recommended products from the same category
      if (data.category) {
        const { data: allProducts } = await getProducts();
        const recommended = allProducts
          .filter(p => p.category === data.category && p._id !== data._id)
          .slice(0, 4);
        setRecommendedProducts(recommended);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate('/address', { state: { product, quantity } });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ 
          padding: 'var(--spacing-3xl) var(--spacing-xl)', 
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--border-color)',
            borderTop: '3px solid var(--brand-color)',
            borderRadius: '50%',
            animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            marginBottom: 'var(--spacing-lg)'
          }} />
          <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-light)' }}>
            Inspecting quality...
          </p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
          <h2 style={{ fontWeight: '800' }}>Executive selection not found</h2>
          <Button onClick={() => navigate('/')} style={{ marginTop: 'var(--spacing-md)' }}>
            Return to Collection
          </Button>
        </div>
      </>
    );
  }

  const hasDiscount = product.originalPrice && product.sellingPrice && product.originalPrice > product.sellingPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <div className="container" style={{ 
        padding: 'var(--spacing-xl) var(--spacing-md)',
        paddingBottom: 'var(--spacing-3xl)'
      }}>
        {/* Back Button */}
        <div 
          onClick={() => navigate(-1)} 
          className="touch-target"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-lg)',
            cursor: 'pointer',
            color: 'var(--text-light)',
            fontWeight: '600',
            fontSize: '14px',
            width: 'fit-content'
          }}
        >
          <ArrowLeft size={18} /> Back to Collection
        </div>
        
        {/* Product Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-3xl)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}>
          {/* Image Gallery */}
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <ImageGallery images={product.images} />
          </div>
          
          {/* Product Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)'
          }}>
            {/* Category Badge */}
            {product.category && (
              <div className="glass" style={{
                display: 'inline-block',
                width: 'fit-content',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--text-color)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                {product.category}
              </div>
            )}

            {/* Product Name */}
            <h1 style={{
              fontSize: 'clamp(2rem, 8vw, 2.5rem)',
              fontWeight: '900',
              marginBottom: '4px',
              color: 'var(--text-color)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em'
            }}>
              {product.name}
            </h1>

            {/* Price Section */}
            <div style={{
              padding: 'var(--spacing-xl)',
              background: 'var(--card-background)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: 'var(--spacing-md)',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                  fontWeight: '900',
                  color: 'var(--text-color)',
                  lineHeight: '1',
                  letterSpacing: '-0.04em'
                }}>
                  ₹{(product.sellingPrice || 0).toLocaleString('en-IN')}
                </div>
                
                {hasDiscount && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    paddingBottom: '4px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-lighter)',
                      textDecoration: 'line-through',
                      fontWeight: '500'
                    }}>
                      ₹{(product.originalPrice || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: 'var(--danger-color)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '800'
                    }}>
                      {discountPercent}% OFF
                    </div>
                  </div>
                )}
              </div>
              
              {hasDiscount && (
                <p style={{
                  fontSize: '14px',
                  color: 'var(--success-color)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ✨ Exclusive savings of ₹{(product.originalPrice - product.sellingPrice).toLocaleString('en-IN')}!
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{
              padding: 'var(--spacing-lg) 0',
              borderTop: '1px solid var(--border-color)'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '900',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--text-lighter)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Description
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--text-light)',
                whiteSpace: 'pre-wrap'
              }}>
                {product.description}
              </p>
            </div>

            {/* Trust Indicators Redesign */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <div style={{
                padding: 'var(--spacing-md)',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <ShieldCheck size={20} color="var(--success-color)" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-color)' }}>7 Days Return</span>
              </div>
              <div style={{
                padding: 'var(--spacing-md)',
                background: 'rgba(124, 58, 237, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontSize: '20px' }}>💵</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-color)' }}>Cash on Delivery</span>
              </div>
            </div>

            {/* Bottom Actions Bar - Sticky for Mobile */}
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '12px',
              zIndex: 100,
              boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'
            }}>
              {/* Quantity Selector Mini */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--background-color)',
                padding: '0 8px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: 'var(--text-color)'
                  }}
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span style={{ fontSize: '16px', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: 'var(--text-color)'
                  }}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>

              <Button 
                onClick={handleBuyNow} 
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: '800',
                  background: 'var(--brand-gradient)',
                  boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
                }}
              >
                Proceed - ₹{(product.sellingPrice * quantity).toLocaleString('en-IN')}
              </Button>
            </div>
            
            {/* Clear the sticky bar space */}
            <div style={{ height: '80px' }} />
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div style={{
            marginTop: 'var(--spacing-2xl)',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
            opacity: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)',
              paddingBottom: 'var(--spacing-sm)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-color)',
                letterSpacing: '-0.5px'
              }}>
                Complete the Look
              </h2>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-lighter)', textTransform: 'uppercase' }}>Recommended</span>
            </div>

            <div className="grid">
              {recommendedProducts.map((recProduct, index) => (
                <div 
                  key={recProduct._id}
                  style={{
                    animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`,
                    opacity: 0
                  }}
                >
                  <ProductCard product={recProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
