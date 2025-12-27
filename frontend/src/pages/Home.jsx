import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Home = () => {
    return (
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFFFFF 100%)',
            padding: '4rem 2rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(211, 47, 47, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0,
            }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
                {/* Logo */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <Logo size="large" showText={true} color="primary" />
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    color: 'var(--primary-color)',
                    marginBottom: '1.5rem',
                    animation: 'fadeIn 1s ease-out',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '900',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                    lineHeight: '1.2',
                }}>
                    Craving Something Delicious?
                </h1>
                
                <p style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    color: 'var(--dark-light)',
                    marginBottom: '3rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem auto',
                    animation: 'fadeIn 1.5s ease-out',
                    lineHeight: '1.8',
                    fontWeight: '400',
                }}>
                    Experience the taste that sparks joy. Fresh ingredients, masterful recipes, and a passion for flavor that brings people together.
                </p>

                {/* Feature Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem',
                    animation: 'fadeIn 2s ease-out',
                }}>
                    {[
                        { icon: '🍽️', title: 'Fresh Menu', desc: 'Daily prepared dishes' },
                        { icon: '🚀', title: 'Fast Delivery', desc: 'Quick & reliable service' },
                        { icon: '⭐', title: 'Top Rated', desc: '5-star customer reviews' },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '2rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-md)',
                                transition: 'all var(--transition-base)',
                                border: '1px solid rgba(211, 47, 47, 0.1)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem', margin: 0 }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    gap: '1.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    animation: 'fadeIn 2.5s ease-out',
                }}>
                    <Link
                        to="/menu"
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)',
                            display: 'inline-block',
                            transition: 'all var(--transition-base)',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(211, 47, 47, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(211, 47, 47, 0.4)';
                        }}
                    >
                        🍕 Start Your Order
                    </Link>
                    <Link
                        to="/reservations"
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'white',
                            color: 'var(--secondary-color)',
                            border: '3px solid var(--secondary-color)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            display: 'inline-block',
                            transition: 'all var(--transition-base)',
                            textDecoration: 'none',
                            boxShadow: 'var(--shadow-md)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--secondary-color)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--secondary-color)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        📅 Book Table
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
