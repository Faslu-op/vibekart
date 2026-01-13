import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../services/api';
import Navbar from '../components/Navbar';
import CategorySection from '../components/CategorySection';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Start both requests in parallel
      const productsPromise = getProducts();
      const categoriesPromise = getCategories();

      // Wait for categories first (smaller payload, faster)
      const categoriesRes = await categoriesPromise;
      const { data: categoryMetadata } = categoriesRes;

      // Then get products
      const productsRes = await productsPromise;
      const { data: products } = productsRes;
      
      // Group products by category
      const grouped = products.reduce((acc, product) => {
        const cat = product.category;
        if (!cat) return acc;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      }, {});
      
      // Determine the final category order
      const metaOrder = categoryMetadata.map(c => c.name);
      const existingCats = Object.keys(grouped);
      const missingInMeta = existingCats.filter(c => !metaOrder.includes(c)).sort();
      const finalOrder = [...metaOrder.filter(c => existingCats.includes(c)), ...missingInMeta];

      // Set everything at once to trigger a single render
      setProductsByCategory(grouped);
      setOrderedCategories(finalOrder);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const categories = Object.keys(productsByCategory).sort();

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div style={{
        background: 'var(--primary-gradient)',
        padding: 'var(--spacing-3xl) 0',
        marginBottom: 'var(--spacing-xl)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'var(--brand-gradient)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.15,
          animation: 'pulse 8s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            textAlign: 'left',
            maxWidth: '600px',
            animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '900',
              color: '#fff',
              marginBottom: 'var(--spacing-md)',
              lineHeight: '1.1',
              letterSpacing: '-0.04em'
            }}>
              Elevate Your <span className="brand-text">Vibe</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: 'var(--spacing-2xl)',
              lineHeight: '1.5',
              maxWidth: '450px'
            }}>
              Discover a curated collection of executive essentials and handcrafted items designed for the modern lifestyle.
            </p>
            
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              overflowX: 'auto',
              paddingBottom: 'var(--spacing-sm)',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
              {orderedCategories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    const id = `category-${cat.toLowerCase().replace(/\s+/g, '-')}`;
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="touch-target"
                  style={{
                    padding: '0 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--radius-full)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products by Category */}
      <div className="container" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
        {loading ? (
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '900', 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--text-color)'
            }}>
              Loading Collections...
            </h2>
            <div className="grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: 'var(--spacing-xl)' 
            }}>
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : orderedCategories.length === 0 ? (
          <div className="glass" style={{
            textAlign: 'center',
            padding: 'var(--spacing-3xl) var(--spacing-xl)',
            borderRadius: 'var(--radius-2xl)',
            animation: 'fadeInUp 0.8s ease forwards'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: 'var(--spacing-lg)',
              filter: 'grayscale(1)'
            }}>🛍️</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Collection Empty
            </h2>
            <p style={{
              color: 'var(--text-light)',
              fontSize: '15px',
              maxWidth: '300px',
              margin: '0 auto'
            }}>
              Our executive curators are currently handpicking new arrivals. Check back soon.
            </p>
          </div>
        ) : (
          orderedCategories.map(category => {
            const products = productsByCategory[category];
            const id = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
            
            return (
              <div key={category} id={id}>
                <CategorySection 
                  category={category} 
                  products={products} 
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
