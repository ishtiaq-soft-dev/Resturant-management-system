import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Cart = () => {
    const { cart, removeFromCart, total, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login first to place an order.',
                icon: 'warning',
                confirmButtonText: 'Go to Login',
                confirmButtonColor: 'var(--primary-color)'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
                <h2 style={{
                    fontSize: '2rem',
                    color: 'var(--primary-color)',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-heading)'
                }}>
                    Your Cart is Empty
                </h2>
                <p style={{ color: 'var(--gray-dark)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Add some delicious items to get started!
                </p>
                <Link
                    to="/menu"
                    style={{
                        padding: '1rem 2.5rem',
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        textDecoration: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        transition: 'all var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            padding: '2rem 1rem',
            maxWidth: '900px',
            margin: '0 auto',
            minHeight: '80vh'
        }}>
            <h2 style={{
                fontSize: '2.5rem',
                color: 'var(--primary-color)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                textAlign: 'center'
            }}>
                🛒 Your Cart
            </h2>
            
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                marginBottom: '2rem'
            }}>
                {cart.map((item, index) => (
                    <div
                        key={item.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.5rem',
                            borderBottom: index < cart.length - 1 ? '1px solid var(--gray-medium)' : 'none',
                            background: index % 2 === 0 ? 'white' : 'var(--gray-light)',
                            transition: 'all var(--transition-base)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fff3e0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = index % 2 === 0 ? 'white' : 'var(--gray-light)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                />
                            )}
                            <div>
                                <h4 style={{
                                    margin: '0 0 0.5rem 0',
                                    color: 'var(--dark-color)',
                                    fontSize: '1.2rem',
                                    fontWeight: '700'
                                }}>
                                    {item.name}
                                </h4>
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    color: 'var(--gray-dark)',
                                    fontSize: '1rem'
                                }}>
                                    ${item.price.toFixed(2)} each
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            border: '2px solid var(--primary-color)',
                                            background: 'white',
                                            color: 'var(--primary-color)',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{
                                        minWidth: '30px',
                                        textAlign: 'center',
                                        fontWeight: '700',
                                        fontSize: '1.1rem'
                                    }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            border: '2px solid var(--primary-color)',
                                            background: 'var(--primary-color)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                            <p style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                color: 'var(--primary-color)'
                            }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#d32f2f';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ff4444';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary Card */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                color: 'white',
                boxShadow: 'var(--shadow-xl)',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                        Subtotal:
                    </h3>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>
                        ${total.toFixed(2)}
                    </span>
                </div>
                <button
                    onClick={handleCheckout}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '1rem',
                        background: 'white',
                        color: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                >
                    🚀 Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
