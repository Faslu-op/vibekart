import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { createOrder } from '../services/api';

const Address = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91-',
    pincode: '',
    city: '',
    state: '',
    houseNo: '',
    roadName: '',
    landmark: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!state || !state.product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
          <h2>No product selected</h2>
          <Button onClick={() => navigate('/')} style={{ marginTop: 'var(--spacing-lg)' }}>
            Go Home
          </Button>
        </div>
      </>
    );
  }

  const { product, quantity } = state;
  const totalAmount = (product.sellingPrice || product.price || 0) * quantity;
  
  // Handle both old format (images as strings) and new format (images as objects)
  const productImage = product.images?.[0]?.url || product.images?.[0] || '';

  const updateField = (field, value) => {
    if (field === 'phone') {
      // Ensure it always starts with +91-
      if (!value.startsWith('+91-')) {
        value = '+91-';
      }
      
      // Only allow digits after +91-
      const suffix = value.slice(4);
      const cleanSuffix = suffix.replace(/\D/g, '').slice(0, 10);
      value = '+91-' + cleanSuffix;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePhone = (phone) => {
    // Must start with +91- and have 10 digits after
    const phoneRegex = /^\+91-[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be in format +91XXXXXXXXXX (10 digits after +91)';
    }
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.houseNo.trim()) newErrors.houseNo = 'House/Building number is required';
    if (!formData.roadName.trim()) newErrors.roadName = 'Road name/Area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          houseNo: formData.houseNo,
          roadName: formData.roadName,
          landmark: formData.landmark || ''
        },
        items: [{ product: product._id, quantity }],
        totalAmount
      };
      await createOrder(orderData);
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Order failed', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ 
        maxWidth: '800px', 
        padding: 'var(--spacing-xl) var(--spacing-md)',
        paddingBottom: 'var(--spacing-3xl)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 2.5rem)',
          fontWeight: '900',
          marginBottom: 'var(--spacing-md)',
          textAlign: 'left',
          color: 'var(--text-color)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          letterSpacing: '-0.04em'
        }}>
          Secure <span className="brand-text">Checkout</span>
        </h1>

        {/* COD Message */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.05)',
          color: 'var(--brand-color)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'left',
          marginBottom: 'var(--spacing-xl)',
          fontSize: '15px',
          fontWeight: '700',
          border: '1px solid rgba(124, 58, 237, 0.1)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards',
          opacity: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>🔐</span>
          Your executive order is secured with Cash on Delivery.
        </div>
        
        {/* Product Summary */}
        <div style={{
          background: 'var(--card-background)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--spacing-xl)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards',
          opacity: 0,
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-lg)',
            paddingBottom: 'var(--spacing-sm)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-lighter)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Order Summary
            </h3>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '800', 
              color: 'var(--brand-color)',
              background: 'rgba(124, 58, 237, 0.1)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)'
            }}>
              {quantity} Item{quantity > 1 ? 's' : ''}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-lg)',
            alignItems: 'center'
          }}>
            <img 
              src={productImage} 
              alt={product.name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)'
              }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '17px',
                fontWeight: '700',
                marginBottom: '4px',
                color: 'var(--text-color)',
                letterSpacing: '-0.2px'
              }}>
                {product.name}
              </h4>
              <p style={{
                fontSize: '28px',
                fontWeight: '900',
                color: 'var(--text-color)',
                letterSpacing: '-0.5px'
              }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--card-background)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
          opacity: 0,
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '900',
            marginBottom: 'var(--spacing-xl)',
            color: 'var(--text-lighter)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            paddingBottom: 'var(--spacing-sm)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            Delivery Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--spacing-lg)' }}>
            {/* Name */}
            <div>
              <label style={styles.label}>👤 Full Name</label>
              <input 
                type="text"
                placeholder="Enter your name"
                value={formData.name} 
                onChange={(e) => updateField('name', e.target.value)} 
                style={{
                  ...styles.input,
                  borderColor: errors.name ? 'var(--danger-color)' : 'var(--border-color)'
                }}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={styles.label}>📞 Phone Number</label>
              <input 
                type="tel"
                value={formData.phone} 
                onChange={(e) => updateField('phone', e.target.value)} 
                style={{
                  ...styles.input,
                  borderColor: errors.phone ? 'var(--danger-color)' : 'var(--border-color)',
                  fontWeight: '700'
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-lighter)', marginTop: '4px', fontWeight: '600' }}>
                10 digits after +91-
              </p>
              {errors.phone && <p style={styles.error}>{errors.phone}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label style={styles.label}>📮 Pincode</label>
              <input 
                type="text"
                placeholder="6-digit PIN"
                value={formData.pincode} 
                onChange={(e) => updateField('pincode', e.target.value)} 
                style={{
                  ...styles.input,
                  borderColor: errors.pincode ? 'var(--danger-color)' : 'var(--border-color)'
                }}
              />
              {errors.pincode && <p style={styles.error}>{errors.pincode}</p>}
            </div>

            {/* City and State */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--spacing-lg)'
            }}>
              <div>
                <label style={styles.label}>🏙 City</label>
                <input 
                  type="text"
                  placeholder="City"
                  value={formData.city} 
                  onChange={(e) => updateField('city', e.target.value)} 
                  style={{
                    ...styles.input,
                    borderColor: errors.city ? 'var(--danger-color)' : 'var(--border-color)'
                  }}
                />
                {errors.city && <p style={styles.error}>{errors.city}</p>}
              </div>
              <div>
                <label style={styles.label}>🌍 State</label>
                <input 
                  type="text"
                  placeholder="State"
                  value={formData.state} 
                  onChange={(e) => updateField('state', e.target.value)} 
                  style={{
                    ...styles.input,
                    borderColor: errors.state ? 'var(--danger-color)' : 'var(--border-color)'
                  }}
                />
                {errors.state && <p style={styles.error}>{errors.state}</p>}
              </div>
            </div>

            {/* House No */}
            <div>
              <label style={styles.label}>🏠 House / Building No.</label>
              <input 
                type="text"
                placeholder="Building, Apartment, House"
                value={formData.houseNo} 
                onChange={(e) => updateField('houseNo', e.target.value)} 
                style={{
                  ...styles.input,
                  borderColor: errors.houseNo ? 'var(--danger-color)' : 'var(--border-color)'
                }}
              />
              {errors.houseNo && <p style={styles.error}>{errors.houseNo}</p>}
            </div>

            {/* Road Name */}
            <div>
              <label style={styles.label}>🛣 Road Name / Area</label>
              <input 
                type="text"
                placeholder="Street name, Sector, Area"
                value={formData.roadName} 
                onChange={(e) => updateField('roadName', e.target.value)} 
                style={{
                  ...styles.input,
                  borderColor: errors.roadName ? 'var(--danger-color)' : 'var(--border-color)'
                }}
              />
              {errors.roadName && <p style={styles.error}>{errors.roadName}</p>}
            </div>

            {/* Landmark (Optional) */}
            <div>
              <label style={styles.label}>📍 Landmark <span style={{ fontWeight: '400', color: 'var(--text-lighter)', fontSize: '12px' }}> (optional)</span></label>
              <input 
                type="text"
                placeholder="Nearby famous place"
                value={formData.landmark} 
                onChange={(e) => updateField('landmark', e.target.value)} 
                style={styles.input}
              />
            </div>
          </div>

          {/* Payment Method - Fixed COD */}
          <div style={{
            marginTop: 'var(--spacing-2xl)',
            marginBottom: 'var(--spacing-lg)',
            padding: 'var(--spacing-xl)',
            background: 'var(--background-color)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--brand-color)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '20px',
              background: 'var(--brand-gradient)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '900',
              padding: '2px 10px',
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase'
            }}>Selected Method</div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              opacity: 1
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#fff'
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '900',
                  color: 'var(--text-color)',
                  marginBottom: '2px'
                }}>
                  Cash on Delivery
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-light)',
                  fontWeight: '500'
                }}>
                  Pay securely at your doorstep.
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>💵</div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary"
            loading={submitting}
            disabled={submitting}
            style={{ 
              width: '100%', 
              marginTop: 'var(--spacing-lg)',
              padding: '18px 32px',
              fontSize: '16px',
              fontWeight: '900',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--brand-gradient)',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
              letterSpacing: '0.05em'
            }}
          >
            {submitting ? 'PROCESSING...' : `CONFIRM ORDER - ₹${totalAmount.toLocaleString('en-IN')}`}
          </Button>
        </form>
      </div>
    </>
  );
};

const styles = {
  label: {
    display: 'block',
    marginBottom: 'var(--spacing-sm)',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-color)'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--border-color)',
    fontSize: '16px',
    fontFamily: 'var(--font-body)',
    transition: 'var(--transition-base)',
    outline: 'none',
    backgroundColor: '#fff'
  },
  error: {
    marginTop: 'var(--spacing-xs)',
    fontSize: '13px',
    color: 'var(--danger-color)',
    animation: 'fadeIn 0.3s ease'
  }
};

export default Address;
