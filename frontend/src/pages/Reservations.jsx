import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Reservations = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ time: '', party_size: 2, requests: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to book a table.',
                icon: 'warning',
                confirmButtonColor: 'var(--primary-color)'
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/reservations', formData);
            Swal.fire({
                title: 'Success!',
                text: 'Your table has been reserved successfully.',
                icon: 'success',
                confirmButtonColor: 'var(--secondary-color)'
            });
            setFormData({ time: '', party_size: 2, requests: '' });
        } catch (err) {
            Swal.fire({
                title: 'Failed',
                text: 'Reservation failed. Please try again.',
                icon: 'error',
                confirmButtonColor: 'var(--primary-color)'
            });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        marginTop: '5px'
    };

    return (
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600") no-repeat center/cover'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', color: 'var(--dark-color)', marginBottom: '10px' }}>Book a Table</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Experience the finest dining with us.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Date & Time</label>
                        <input
                            type="datetime-local"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Party Size</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.party_size}
                            onChange={(e) => setFormData({ ...formData, party_size: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Special Requests (Optional)</label>
                        <textarea
                            placeholder="Allergies, anniversaries, special seating..."
                            value={formData.requests}
                            onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '15px',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '10px',
                            boxShadow: '0 5px 15px rgba(211, 47, 47, 0.3)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processing...' : 'Confirm Reservation'}
                    </button>

                    {!user && (
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#777' }}>
                            You need to <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link> to complete your booking.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Reservations;
