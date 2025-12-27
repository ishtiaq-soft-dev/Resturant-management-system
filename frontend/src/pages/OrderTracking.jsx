import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#757575';
            case 'accepted': return '#4CAF50';
            case 'preparing': return '#FF9800';
            case 'ready': return '#2196F3';
            case 'on_the_way': return '#9C27B0';
            case 'delivered':
            case 'picked_up': return '#4CAF50';
            default: return '#000';
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading your orders...</div>;

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '2.5rem', fontSize: '2.5rem', fontWeight: '900' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3>You haven't placed any orders yet</h3>
                    <p style={{ color: '#777', margin: '15px 0 25px 0' }}>Hungry? Browse our menu and place your first order!</p>
                    <Link to="/menu" style={{
                        display: 'inline-block',
                        padding: '12px 30px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            background: 'white',
                            padding: '25px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            borderLeft: `5px solid ${getStatusColor(order.status)}`,
                            transition: 'transform 0.2s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Order #{order.id}</h3>
                                    <p style={{ color: '#777', fontSize: '0.9rem', margin: 0 }}>
                                        {new Date(order.date).toLocaleString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                                        {order.items.map((item, idx) => (
                                            <span key={idx} style={{
                                                background: '#f5f5f5',
                                                padding: '4px 12px',
                                                borderRadius: '15px',
                                                fontSize: '0.85rem',
                                                color: '#555'
                                            }}>
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '6px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        background: `${getStatusColor(order.status)}22`,
                                        color: getStatusColor(order.status),
                                        textTransform: 'uppercase',
                                        marginBottom: '10px'
                                    }}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                    {(order.status === 'delivered' || order.status === 'picked_up') && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <Link
                                                to={`/reviews?productId=${order.items[0]?.combo_id ? `combo_${order.items[0].combo_id}` : order.items[0]?.id}`}
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '8px 20px',
                                                    background: 'var(--secondary-color)',
                                                    color: 'white',
                                                    borderRadius: '20px',
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 10px rgba(255, 152, 0, 0.3)'
                                                }}
                                            >
                                                Rate & Review
                                            </Link>
                                        </div>
                                    )}
                                    <p style={{ margin: 0, fontWeight: '900', fontSize: '1.4rem', color: 'var(--dark-color)' }}>
                                        ${order.total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
