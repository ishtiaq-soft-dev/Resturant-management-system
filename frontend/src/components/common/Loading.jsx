/**
 * Loading component for better UX
 */
import React from 'react';
import Logo from './Logo';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem'
        }}>
            <div style={{ position: 'relative' }}>
                <Logo size="large" showText={false} color="primary" />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    border: '4px solid rgba(211, 47, 47, 0.1)',
                    borderTop: '4px solid var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
            <p style={{
                color: 'var(--dark-light)',
                fontSize: '1.1rem',
                fontWeight: '500',
                margin: 0
            }}>{message}</p>
            <style>{`
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(Loading);

