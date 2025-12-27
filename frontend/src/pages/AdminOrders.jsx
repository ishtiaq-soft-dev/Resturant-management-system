import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const btnBase = {
        padding: '10px 25px',
        borderRadius: '30px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            Swal.fire('Success', `Order marked as ${newStatus.replace(/_/g, ' ')}`, 'success');
            fetchOrders();
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading orders...</div>;

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '900' }}>Manage Orders</h1>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.id} style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '15px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        borderLeft: `5px solid ${getStatusColor(order.status)}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Order #{order.id} - Customer: {order.customer}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{new Date(order.date).toLocaleString()}</p>
                                <p style={{ fontWeight: 'bold', color: 'var(--primary-color)', margin: '5px 0' }}>Total: ${order.total.toFixed(2)}</p>
                                <p style={{ fontSize: '0.9rem' }}>Type: {order.type} | Payment: {order.payment}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusUpdate(order.id, 'accepted')} style={{ ...btnBase, background: '#4CAF50', color: 'white' }}>Accept</button>
                                        <button onClick={() => handleStatusUpdate(order.id, 'denied')} style={{ ...btnBase, background: '#f44336', color: 'white' }}>Deny</button>
                                    </>
                                )}
                                {order.status === 'accepted' && (
                                    <button onClick={() => handleStatusUpdate(order.id, 'preparing')} style={{ ...btnBase, background: '#FF9800', color: 'white' }}>Start Preparing</button>
                                )}
                                {order.status === 'preparing' && (
                                    <button onClick={() => handleStatusUpdate(order.id, 'ready')} style={{ ...btnBase, background: '#2196F3', color: 'white' }}>Mark Ready</button>
                                )}
                                {order.status === 'ready' && order.type === 'delivery' && (
                                    <button onClick={() => handleStatusUpdate(order.id, 'on_the_way')} style={{ ...btnBase, background: '#9C27B0', color: 'white' }}>On the Way</button>
                                )}
                                {(order.status === 'ready' || order.status === 'on_the_way') && (
                                    <button onClick={() => handleStatusUpdate(order.id, order.type === 'pickup' ? 'picked_up' : 'delivered')} style={{ ...btnBase, background: '#4CAF50', color: 'white' }}>
                                        {order.type === 'pickup' ? 'Picked Up' : 'Delivered'}
                                    </button>
                                )}
                                <span style={{
                                    padding: '5px 15px',
                                    borderRadius: '20px',
                                    background: '#f0f0f0',
                                    fontWeight: 'bold',
                                    color: getStatusColor(order.status)
                                }}>
                                    {order.status.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Items:</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {order.items.map((item, idx) => (
                                    <li key={idx}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {orders.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>No orders found.</p>}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return '#757575';
        case 'accepted': return '#4CAF50';
        case 'denied': return '#f44336';
        case 'preparing': return '#FF9800';
        case 'ready': return '#2196F3';
        case 'on_the_way': return '#9C27B0';
        case 'delivered':
        case 'picked_up': return '#4CAF50';
        default: return '#000';
    }
};

export default AdminOrders;
