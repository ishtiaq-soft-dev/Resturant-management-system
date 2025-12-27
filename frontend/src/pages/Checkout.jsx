import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const [payment, setPayment] = useState('cash');
    const [type, setType] = useState('delivery');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const navigate = useNavigate();

    const discount = appliedCoupon ? (total * appliedCoupon.discount / 100) : 0;
    const finalTotal = total - discount;

    const handleApplyCoupon = async () => {
        try {
            const res = await axios.post('/api/coupons/verify', { code: couponCode });
            if (res.data.valid) {
                setAppliedCoupon({ code: couponCode, discount: res.data.discount });
                setCouponError('');
            }
        } catch (err) {
            setCouponError('Invalid or expired coupon');
            setAppliedCoupon(null);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleOrder = async () => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login first to place an order.',
                icon: 'warning',
                confirmButtonColor: '#D32F2F',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        try {
            await axios.post('/api/orders', {
                items: cart.map(i => ({
                    id: i.id,
                    quantity: i.quantity,
                    name: i.name,
                    price: i.price
                })),
                total: finalTotal,
                payment,
                type
            });
            clearCart();
            navigate('/tracking');
        } catch (err) {
            console.error('Order Error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred. Please try again.';
            Swal.fire({
                title: 'Order Failed',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#D32F2F'
            });
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Link to="/menu" style={{ color: 'var(--primary-color)' }}>Browse Menu</Link>
            </div>
        );
    }

    const optionStyle = (isSelected) => ({
        padding: '15px 25px',
        borderRadius: '12px',
        border: isSelected ? '2px solid var(--primary-color)' : '2px solid #ddd',
        background: isSelected ? 'rgba(211, 47, 47, 0.1)' : 'white',
        cursor: 'pointer',
        flex: 1,
        textAlign: 'center',
        fontWeight: isSelected ? 'bold' : 'normal',
        color: isSelected ? 'var(--primary-color)' : 'var(--dark-color)',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{ padding: '40px 60px', background: 'var(--light-color)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ color: 'var(--dark-color)', marginBottom: '30px' }}>Checkout</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
                    {/* Left Column - Options */}
                    <div>
                        {/* Order Type */}
                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--dark-color)' }}>Order Type</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={optionStyle(type === 'delivery')} onClick={() => setType('delivery')}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>Delivery</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>To your doorstep</p>
                                </div>
                                <div style={optionStyle(type === 'pickup')} onClick={() => setType('pickup')}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>Pickup</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>From restaurant</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--dark-color)' }}>Payment Method</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={optionStyle(payment === 'cash')} onClick={() => setPayment('cash')}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>Cash</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>Pay on delivery</p>
                                </div>
                                <div style={optionStyle(payment === 'card')} onClick={() => setPayment('card')}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>Card</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>Debit/Credit</p>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Code */}
                        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--dark-color)' }}>Have a Coupon?</h3>
                            {appliedCoupon ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(76, 175, 80, 0.1)',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: '2px solid #4CAF50'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#4CAF50' }}>
                                            V {appliedCoupon.code} Applied!
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                            {appliedCoupon.discount}% off your order
                                        </p>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        X Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            style={{
                                                flex: 1,
                                                padding: '15px',
                                                borderRadius: '10px',
                                                border: '2px solid #ddd',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            style={{
                                                padding: '15px 25px',
                                                background: 'var(--secondary-color)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p style={{ color: '#f44336', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
                                            {couponError}
                                        </p>
                                    )}
                                    <p style={{ color: '#777', fontSize: '0.85rem', margin: '10px 0 0 0' }}>
                                        Try: WELCOME20, FOODIE10, HOLIDAY25
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--dark-color)' }}>Order Summary</h3>

                        <div style={{ marginBottom: '20px' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        {appliedCoupon && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4CAF50' }}>
                                <span>Discount ({appliedCoupon.discount}%)</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}

                        <hr style={{ border: 'none', borderTop: '2px solid #eee', margin: '15px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary-color)' }}>${finalTotal.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleOrder}
                            style={{
                                width: '100%',
                                marginTop: '25px',
                                padding: '18px',
                                background: user ? 'var(--primary-color)' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: user ? '0 5px 20px rgba(211, 47, 47, 0.3)' : 'none'
                            }}
                        >
                            {user ? `Place Order - $${finalTotal.toFixed(2)}` : 'Login to Place Order'}
                        </button>
                        {!user && (
                            <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                <Link to="/login" style={{ color: 'inherit' }}>Sign in required</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

