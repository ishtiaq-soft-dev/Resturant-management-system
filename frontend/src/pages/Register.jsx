import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../components/common/Logo';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', address: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password, formData.address, formData.role);
            Swal.fire({
                title: 'Success! 🎉',
                text: 'Account created successfully. Please login.',
                icon: 'success',
                confirmButtonColor: 'var(--secondary-color)'
            }).then(() => {
                navigate('/login');
            });
        } catch (err) {
            Swal.fire({
                title: 'Registration Failed',
                text: err.response?.data?.message || 'Email already exists or invalid data.',
                icon: 'error',
                confirmButtonColor: 'var(--primary-color)'
            });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--gray-medium)',
        fontSize: '1rem',
        transition: 'all var(--transition-base)',
        fontFamily: 'inherit',
    };

    return (
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
        }}>
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '3rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(211, 47, 47, 0.1)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Logo size="medium" showText={true} color="primary" />
                </div>
                
                <h2 style={{
                    fontSize: '2rem',
                    color: 'var(--primary-color)',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '800',
                }}>
                    Create Account
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--gray-dark)',
                    marginBottom: '2rem',
                }}>
                    Join us and start your food journey today!
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--dark-color)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gray-medium)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--dark-color)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gray-medium)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--dark-color)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gray-medium)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--dark-color)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                        }}>
                            Address
                        </label>
                        <textarea
                            placeholder="Your delivery address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            style={{
                                ...inputStyle,
                                minHeight: '80px',
                                resize: 'vertical',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gray-medium)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--dark-color)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                        }}>
                            Account Type
                        </label>
                        <select
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            value={formData.role}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gray-medium)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <option value="customer">👤 Customer</option>
                            <option value="admin">👑 Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: loading
                                ? 'var(--gray-medium)'
                                : 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all var(--transition-base)',
                            boxShadow: loading ? 'none' : 'var(--shadow-lg)',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }
                        }}
                    >
                        {loading ? 'Creating Account...' : '✨ Create Account'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'var(--gray-dark)',
                }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: 'var(--primary-color)',
                            fontWeight: '700',
                            textDecoration: 'none',
                        }}
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
