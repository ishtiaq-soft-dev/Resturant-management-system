import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../components/common/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            Swal.fire({
                title: 'Welcome Back!',
                text: 'You have successfully logged in.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
            navigate('/');
        } catch (err) {
            Swal.fire({
                title: 'Login Failed',
                text: err.response?.data?.message || 'Invalid email or password.',
                icon: 'error',
                confirmButtonColor: 'var(--primary-color)'
            });
        } finally {
            setLoading(false);
        }
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
                maxWidth: '450px',
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
                    Welcome Back!
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--gray-dark)',
                    marginBottom: '2rem',
                }}>
                    Sign in to continue your food journey
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--gray-medium)',
                                fontSize: '1rem',
                                transition: 'all var(--transition-base)',
                                fontFamily: 'inherit',
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
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--gray-medium)',
                                fontSize: '1rem',
                                transition: 'all var(--transition-base)',
                                fontFamily: 'inherit',
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
                        {loading ? 'Logging in...' : '🔐 Login'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'var(--gray-dark)',
                }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: 'var(--primary-color)',
                            fontWeight: '700',
                            textDecoration: 'none',
                        }}
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
