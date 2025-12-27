import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await axios.get('/api/admin/reservations');
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (resId, newStatus) => {
        try {
            await axios.patch(`/api/admin/reservations/${resId}/status`, { status: newStatus });
            Swal.fire('Success', `Reservation marked as ${newStatus}`, 'success');
            fetchReservations();
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading reservations...</div>;

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '900' }}>Manage Reservations</h1>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {reservations.map(res => (
                    <div key={res.id} style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderLeft: `5px solid #4CAF50`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>Customer: {res.customer}</h3>
                            <p style={{ margin: '5px 0', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {new Date(res.time).toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                                Party Size: <span style={{ fontWeight: 'bold', color: 'var(--dark-color)' }}>{res.party_size} people</span>
                            </p>
                            {res.requests && (
                                <p style={{ margin: '15px 0 0 0', padding: '10px', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', borderLeft: '3px solid #ddd' }}>
                                    <strong>Requests:</strong> {res.requests}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{
                                padding: '8px 20px',
                                borderRadius: '25px',
                                background: res.status === 'confirmed' ? '#E8F5E9' : (res.status === 'cancelled' ? '#FFEBEE' : '#E3F2FD'),
                                color: res.status === 'confirmed' ? '#2E7D32' : (res.status === 'cancelled' ? '#C62828' : '#1976D2'),
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                fontSize: '0.8rem'
                            }}>
                                {res.status}
                            </span>
                            {res.status === 'confirmed' && (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                                        style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(res.id, 'completed')}
                                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {reservations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#777' }}>
                    <p>No reservations found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReservations;
