import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);
    const [combos, setCombos] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        target_id: '',
        rating: 5,
        comment: ''
    });

    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');

    useEffect(() => {
        fetchReviews();
        fetchMenuItems();
        fetchCombos();

        if (productId) {
            setFormData(prev => ({ ...prev, target_id: productId }));
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const res = await axios.get('/api/menu');
            setMenuItems(res.data);
        } catch (err) {
            console.error('Failed to fetch menu items', err);
        }
    };

    const fetchCombos = async () => {
        try {
            const res = await axios.get('/api/combos');
            setCombos(res.data);
        } catch (err) {
            console.error('Failed to fetch combos', err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!formData.target_id) {
            Swal.fire('Error', 'Please select a product to review', 'error');
            return;
        }

        const isCombo = formData.target_id.startsWith('combo_');
        const id = isCombo ? formData.target_id.replace('combo_', '') : formData.target_id;
        const endpoint = isCombo ? `/api/combos/${id}/reviews` : `/api/menu/${id}/reviews`;

        setSubmitting(true);
        try {
            await axios.post(endpoint, {
                rating: formData.rating,
                comment: formData.comment
            });
            Swal.fire('Success', 'Your review has been submitted!', 'success');
            setFormData({ target_id: '', rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            Swal.fire('Error', 'Failed to submit review', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading reviews...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: '900' }}>Customer Reviews</h1>

            {user ? (
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    marginBottom: '50px',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Share Your Experience</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Product</label>
                                <select
                                    value={formData.target_id}
                                    onChange={(e) => setFormData({ ...formData, target_id: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                                    required
                                >
                                    <option value="">-- Choose an item or combo --</option>
                                    <optgroup label="Menu Items">
                                        {menuItems.map(item => (
                                            <option key={`item_${item.id}`} value={item.id}>{item.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Combo Deals">
                                        {combos.map(combo => (
                                            <option key={`combo_${combo.id}`} value={`combo_${combo.id}`}>{combo.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
                                <select
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                                >
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Review</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="What did you think of the food and service?"
                                style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', minHeight: '120px', outline: 'none' }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '12px 30px',
                                borderRadius: '30px',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1,
                                width: '100%'
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginBottom: '50px', padding: '30px', background: '#f9f9f9', borderRadius: '20px' }}>
                    <p style={{ color: '#666' }}>Please <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>login</a> to share your review.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {reviews.map((r) => (
                    <div key={r.id} style={{
                        background: 'white',
                        padding: '25px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderTop: '5px solid var(--primary-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>{r.user}</span>
                            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{renderStars(r.rating)}</span>
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#555', fontSize: '0.9rem', marginBottom: '15px' }}>
                            Replied for: <span style={{ fontWeight: 'bold' }}>{r.item_name}</span>
                        </p>
                        <p style={{ lineHeight: '1.6', color: '#333' }}>"{r.comment}"</p>
                        <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#999' }}>
                            {new Date(r.date).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <p style={{ textAlign: 'center', color: '#777', padding: '50px' }}>No reviews yet. Be the first to review!</p>
            )}
        </div>
    );
};

export default Reviews;
