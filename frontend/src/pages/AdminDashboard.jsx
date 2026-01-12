import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, addProduct, deleteProduct, getProducts, updateProduct, updateOrderStatus, deleteOrder, getCategories, syncCategories, reorderCategories } from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import { Trash2, Plus, X, Upload, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [orderFilter, setOrderFilter] = useState('Pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [copyFeedback, setCopyFeedback] = useState(null); // format: {id, field}
  
  // Product State (for Add/Edit)
  const [productForm, setProductForm] = useState({
    name: '',
    sellingPrice: '',
    originalPrice: '',
    description: '',
    category: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const productsRes = await getProducts();
      setProducts(productsRes.data);
      const ordersRes = await getOrders();
      setOrders(ordersRes.data); 
      const catRes = await getCategories();
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSyncCategories = async () => {
    setIsSyncing(true);
    try {
      const res = await syncCategories();
      setCategories(res.data);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMoveCategory = async (index, direction) => {
    const newCategories = [...categories];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;
    
    // Swap
    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
    
    // Update orderIndex locally for UI smoothness
    const reordered = newCategories.map((cat, i) => ({
      id: cat._id,
      orderIndex: i
    }));

    setCategories(newCategories.map((cat, i) => ({ ...cat, orderIndex: i })));

    try {
      await reorderCategories(reordered);
    } catch (error) {
      console.error('Reorder failed:', error);
      fetchData(); // Reset on error
    }
  };

  const resetForm = () => {
    setProductForm({ name: '', sellingPrice: '', originalPrice: '', description: '', category: '' });
    setSelectedImages([]);
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      sellingPrice: product.sellingPrice,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category || ''
    });
    setImagePreviews(product.images.map(img => img.url));
    setShowAddModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (editingProduct ? imagePreviews.length : 0) > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setSelectedImages([...selectedImages, ...files]);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    const newSelectedImages = selectedImages.filter((_, i) => i !== (index - (editingProduct ? 0 : 0)));
    setSelectedImages(newSelectedImages);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (imagePreviews.length === 0) {
      alert('Please select at least one image');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('sellingPrice', productForm.sellingPrice);
      formData.append('originalPrice', productForm.originalPrice);
      formData.append('description', productForm.description);
      formData.append('category', productForm.category.trim());
      selectedImages.forEach(image => formData.append('images', image));
      
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await addProduct(formData);
      }
      
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const copyField = async (orderId, fieldName, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback({ id: orderId, field: fieldName });
      setTimeout(() => setCopyFeedback(null), 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const copyFullAddress = async (orderId, customer) => {
    const addressText = `
👤 Name: ${customer.name}
📞 Phone: ${customer.phone}
📮 Pincode: ${customer.pincode}
🏙 City: ${customer.city}
🌍 State: ${customer.state}
🏠 House No: ${customer.houseNo}
🛣 Road: ${customer.roadName}
📍 Landmark: ${customer.landmark || 'None'}
    `.trim();

    try {
      await navigator.clipboard.writeText(addressText);
      setCopyFeedback({ id: orderId, field: 'FULL' });
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleStatusToggle = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: nextStatus } : o));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to permanently delete this COMPLETED order?')) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter(o => o._id !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Only completed orders can be removed.');
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const datePart = date.toLocaleDateString('en-GB', options);
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} • ${timePart}`;
  };

  const filteredOrders = orders.filter(o => o.status === orderFilter);

  const styles = {
    layout: { minHeight: '100vh', background: 'var(--background-color)', paddingBottom: 'var(--spacing-3xl)' },
    header: { background: '#fff', padding: isMobile ? 'var(--spacing-md) var(--spacing-lg)' : 'var(--spacing-xl) 0', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--spacing-2xl)', position: 'sticky', top: 0, zIndex: 100 },
    tabBar: { display: 'flex', gap: '8px', background: 'var(--background-color)', padding: '4px', borderRadius: 'var(--radius-lg)', width: 'fit-content' },
    tab: (active, variant = 'brand') => ({
      padding: '10px 24px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease',
      background: active ? (variant === 'brand' ? 'var(--brand-gradient)' : 'var(--success-gradient)') : 'transparent',
      color: active ? '#fff' : 'var(--text-light)', border: 'none', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
    }),
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--spacing-xl)' },
    card: { background: '#fff', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-xl)', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'var(--transition-base)', position: 'relative' },
    orderDetail: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', marginBottom: '8px', fontSize: '15px', alignItems: 'center' },
    copyIconBtn: (copied) => ({
      padding: '6px', borderRadius: 'var(--radius-sm)', background: copied ? 'var(--success-gradient)' : 'var(--background-color)',
      color: copied ? '#fff' : 'var(--text-lighter)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s ease'
    })
  };

  return (
    <div style={styles.layout}>
      <Navbar />
      <div style={styles.header}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', letterSpacing: '-1px' }}>Admin <span className="brand-text">Executive</span></h1>
            <p style={{ fontSize: '13px', color: 'var(--text-lighter)', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Command Center</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={styles.tabBar}>
              <button style={styles.tab(activeTab === 'products')} onClick={() => setActiveTab('products')}>Products</button>
              <button style={styles.tab(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>Orders</button>
              <button style={styles.tab(activeTab === 'sequence')} onClick={() => setActiveTab('sequence')}>Sequence</button>
            </div>
            <Button variant="outline" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="container">
        {activeTab === 'products' && (
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
              <Button onClick={() => setShowAddModal(true)} style={{ background: 'var(--brand-gradient)' }}><Plus size={18} style={{ marginRight: '8px' }} /> ADD NEW COLLECTION</Button>
            </div>
            <div style={styles.grid}>
              {products.map(p => (
                <div key={p._id} style={styles.card}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <img src={p.images?.[0]?.url || ''} alt={p.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', background: 'var(--background-color)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-color)', marginBottom: '4px' }}>{p.name}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-lighter)', fontWeight: '600', textTransform: 'uppercase' }}>{p.category}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <span style={{ fontSize: '20px', fontWeight: '900' }}>₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-lighter)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button onClick={() => handleEditClick(p)} style={{ flex: 1, padding: '10px', background: 'var(--background-color)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>EDIT PRODUCT</button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: 'var(--radius-md)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            {/* Order Filters */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-2xl)' }}>
              <div style={{ ...styles.tabBar, padding: '6px' }}>
                <button style={styles.tab(orderFilter === 'Pending')} onClick={() => setOrderFilter('Pending')}>PENDING ORDERS</button>
                <button style={styles.tab(orderFilter === 'Completed', 'success')} onClick={() => setOrderFilter('Completed')}>COMPLETED ORDERS</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-lighter)' }}>
                  <img src="/empty-cart.png" alt="Empty" style={{ width: '120px', opacity: 0.3, marginBottom: '20px' }} />
                  <p style={{ fontWeight: '700' }}>No {orderFilter.toLowerCase()} orders found.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order._id} style={{ ...styles.card, padding: '0', overflow: 'hidden', border: order.status === 'Completed' ? '1px solid #10b981' : '1px solid var(--border-color)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(240, 241, 243, 0.4)' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-lighter)' }}>ORDER RECEIVED: {formatDateTime(order.createdAt)}</span>
                        <h3 style={{ fontSize: '18px', fontWeight: '900' }}>#{order._id.slice(-6)}</h3>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {order.status === 'Completed' && (
                          <button 
                            onClick={() => handleDeleteOrder(order._id)}
                            style={{ padding: '8px', borderRadius: ' var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusToggle(order._id, order.status)}
                          style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: 'none', background: order.status === 'Pending' ? '#10b981' : 'var(--brand-color)', color: '#fff', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}
                        >
                          MARK AS {order.status === 'Pending' ? 'COMPLETED' : 'PENDING'}
                        </button>
                        <div style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', background: order.status === 'Pending' ? '#fbbf24' : '#10b981', color: '#fff', fontSize: '11px', fontWeight: '900' }}>
                          {order.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '0' }}>
                      <div style={{ padding: '24px', borderRight: isMobile ? 'none' : '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '900' }}>CUSTOMER LOGISTICS</h4>
                          <button onClick={() => copyFullAddress(order._id, order.customer)} style={{ ...styles.copyIconBtn(copyFeedback?.id === order._id && copyFeedback?.field === 'FULL'), width: 'auto', padding: '6px 12px', fontSize: '11px', fontWeight: '900' }}>
                            {copyFeedback?.id === order._id && copyFeedback?.field === 'FULL' ? '✓ FULL ADDRESS COPIED' : 'COPY ALL'}
                          </button>
                        </div>
                        <div style={{ background: 'var(--background-color)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                          {[
                            { icon: '👤', label: 'Name', value: order.customer.name, key: 'name' },
                            { icon: '📞', label: 'Phone', value: order.customer.phone, key: 'phone' },
                            { icon: '📮', label: 'Pincode', value: order.customer.pincode, key: 'pincode' },
                            { icon: '🏙', label: 'City', value: order.customer.city, key: 'city' },
                            { icon: '🌍', label: 'State', value: order.customer.state, key: 'state' },
                            { icon: '🏠', label: 'House No', value: order.customer.houseNo, key: 'houseNo' },
                            { icon: '🛣', label: 'Road', value: order.customer.roadName, key: 'roadName' },
                            { icon: '📍', label: 'Landmark', value: order.customer.landmark || '—', key: 'landmark' }
                          ].map((field, i) => (
                            <div key={i} style={styles.orderDetail}>
                              <span style={{ fontSize: '16px' }}>{field.icon}</span>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-lighter)', textTransform: 'uppercase' }}>{field.label}</span>
                                <span style={{ fontWeight: '700', fontSize: '14px', display: 'block' }}>{field.value}</span>
                              </div>
                              <button 
                                onClick={() => copyField(order._id, field.key, field.value)}
                                style={styles.copyIconBtn(copyFeedback?.id === order._id && copyFeedback?.field === field.key)}
                              >
                                {copyFeedback?.id === order._id && copyFeedback?.field === field.key ? '✓' : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: '24px', background: 'rgba(248, 249, 251, 0.5)' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '900', marginBottom: '20px' }}>COLLECTION DETAILS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                              <span style={{ fontWeight: '700', fontSize: '13px' }}>{item.product?.name || 'Deleted Product'}</span>
                              <span style={{ fontWeight: '900', fontSize: '13px', color: 'var(--brand-color)' }}>x {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
                          <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-lighter)' }}>ORDER VALUE</p>
                          <h2 style={{ fontSize: '28px', fontWeight: '900' }}>₹{order.totalAmount.toLocaleString('en-IN')}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'sequence' && (
          <div style={{ animation: 'fadeInUp 0.6s ease', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Home Sequence</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-lighter)', fontWeight: '700' }}>Manage Category Order</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSyncCategories} 
                disabled={isSyncing}
                style={{ fontSize: '12px', borderColor: 'var(--brand-color)', color: 'var(--brand-color)' }}
              >
                <RefreshCw size={14} style={{ marginRight: '8px', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                SMART SYNC
              </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {categories.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-lighter)' }}>
                  <p style={{ fontWeight: '700' }}>No categories detected. Click "Smart Sync" to import.</p>
                </div>
              ) : (
                categories.map((cat, index) => (
                  <div 
                    key={cat._id} 
                    style={{ 
                      padding: '20px 24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      borderBottom: index === categories.length - 1 ? 'none' : '1px solid var(--border-color)',
                      background: index % 2 === 0 ? '#fff' : 'rgba(240, 241, 243, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ 
                        width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', 
                        background: 'var(--background-color)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontSize: '14px', 
                        fontWeight: '900', color: 'var(--text-lighter)' 
                      }}>
                        {index + 1}
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-color)' }}>{cat.name}</h4>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleMoveCategory(index, -1)}
                        disabled={index === 0}
                        style={{ 
                          padding: '8px', borderRadius: 'var(--radius-sm)', 
                          background: index === 0 ? 'transparent' : 'var(--background-color)', 
                          border: 'none', cursor: index === 0 ? 'default' : 'pointer',
                          color: index === 0 ? 'rgba(0,0,0,0.1)' : 'var(--brand-color)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button 
                        onClick={() => handleMoveCategory(index, 1)}
                        disabled={index === categories.length - 1}
                        style={{ 
                          padding: '8px', borderRadius: 'var(--radius-sm)', 
                          background: index === categories.length - 1 ? 'transparent' : 'var(--background-color)', 
                          border: 'none', cursor: index === categories.length - 1 ? 'default' : 'pointer',
                          color: index === categories.length - 1 ? 'rgba(0,0,0,0.1)' : 'var(--brand-color)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-2xl)', padding: '32px', position: 'relative' }}>
            <button onClick={() => { setShowAddModal(false); resetForm(); }} style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'var(--background-color)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>{editingProduct ? 'Edit Executive Product' : 'Add New Collection'}</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>Curate your store's high-end inventory.</p>
            <form onSubmit={handleProductSubmit}>
              <div style={{ marginBottom: '20px' }}><Input label="Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <Input label="Selling Price (₹)" type="number" value={productForm.sellingPrice} onChange={e => setProductForm({...productForm, sellingPrice: e.target.value})} required />
                <Input label="Original Price (₹)" type="number" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} required />
              </div>
              <div style={{ marginBottom: '20px' }}><Input label="Category" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required placeholder="e.g. Executive Decor" /></div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700' }}>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', minHeight: '120px', fontSize: '15px', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '700' }}>Executive Assets (Max 5)</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center', cursor: 'pointer', background: 'var(--background-color)' }}>
                  <input type="file" multiple onChange={handleImageChange} style={{ display: 'none' }} id="admin-image-upload" />
                  <label htmlFor="admin-image-upload" style={{ cursor: 'pointer' }}>
                    <Upload size={32} style={{ color: 'var(--brand-color)', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-light)' }}>Click or drag to add premium images</p>
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
                    {imagePreviews.map((p, i) => (
                      <div key={i} style={{ aspectRatio: '1/1', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
                        <img src={p} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" variant="primary" style={{ width: '100%', padding: '18px', fontWeight: '900' }}>{editingProduct ? 'UPDATE COLLECTION' : 'LAUNCH PRODUCT'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
