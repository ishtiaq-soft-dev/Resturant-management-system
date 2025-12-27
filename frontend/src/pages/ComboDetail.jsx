import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';

// Customization options
const CUSTOMIZATIONS = {
    sauces: [
        { id: 'ketchup', name: 'Ketchup', price: 0 },
        { id: 'mayo', name: 'Mayonnaise', price: 0 },
        { id: 'bbq', name: 'BBQ Sauce', price: 0.50 },
        { id: 'ranch', name: 'Ranch', price: 0.50 },
        { id: 'sriracha', name: 'Sriracha Mayo', price: 0.75 },
        { id: 'garlic', name: 'Garlic Aioli', price: 0.75 }
    ],
    sides: [
        { id: 'fries', name: 'French Fries', price: 0 },
        { id: 'onion_rings', name: 'Onion Rings', price: 1.50 },
        { id: 'coleslaw', name: 'Coleslaw', price: 1.00 },
        { id: 'salad', name: 'Side Salad', price: 2.00 },
        { id: 'sweet_potato', name: 'Sweet Potato Fries', price: 1.50 }
    ],
    drinks: [
        { id: 'coke', name: 'Coca-Cola', price: 0 },
        { id: 'sprite', name: 'Sprite', price: 0 },
        { id: 'fanta', name: 'Fanta', price: 0 },
        { id: 'water', name: 'Mineral Water', price: 0 },
        { id: 'iced_tea', name: 'Iced Tea', price: 0.50 }
    ],
    sizes: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large (+50%)', price: 3.00 }
    ]
};

const ComboDetail = () => {
    const { id } = useParams();
    const [combo, setCombo] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({
        sauce: 'ketchup',
        side: 'fries',
        drink: 'coke',
        size: 'regular'
    });
    const [specialInstructions, setSpecialInstructions] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get('/api/combos').then(res => {
            const foundCombo = res.data.find(c => c.id === parseInt(id));
            setCombo(foundCombo);
        });
    }, [id]);

    if (!combo) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
    }

    const getExtraPrice = () => {
        let extra = 0;
        extra += CUSTOMIZATIONS.sauces.find(s => s.id === selectedOptions.sauce)?.price || 0;
        extra += CUSTOMIZATIONS.sides.find(s => s.id === selectedOptions.side)?.price || 0;
        extra += CUSTOMIZATIONS.drinks.find(s => s.id === selectedOptions.drink)?.price || 0;
        extra += CUSTOMIZATIONS.sizes.find(s => s.id === selectedOptions.size)?.price || 0;
        return extra;
    };

    const totalPrice = combo.combo_price + getExtraPrice();

    const handleAddToCart = () => {
        // Add combo with customizations
        addToCart({
            id: `combo-${combo.id}-${Date.now()}`,
            name: combo.name,
            price: totalPrice,
            image_url: combo.image_url,
            isCombo: true,
            customizations: {
                sauce: CUSTOMIZATIONS.sauces.find(s => s.id === selectedOptions.sauce)?.name,
                side: CUSTOMIZATIONS.sides.find(s => s.id === selectedOptions.side)?.name,
                drink: CUSTOMIZATIONS.drinks.find(s => s.id === selectedOptions.drink)?.name,
                size: CUSTOMIZATIONS.sizes.find(s => s.id === selectedOptions.size)?.name,
                specialInstructions
            },
            items: combo.items
        });
        Swal.fire({
            title: 'Added!',
            text: `"${combo.name}" has been added to your cart.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    const optionButtonStyle = (isSelected) => ({
        padding: '10px 20px',
        borderRadius: '25px',
        border: isSelected ? '2px solid var(--primary-color)' : '2px solid #ddd',
        background: isSelected ? 'var(--primary-color)' : 'white',
        color: isSelected ? 'white' : 'var(--dark-color)',
        cursor: 'pointer',
        fontWeight: isSelected ? 'bold' : 'normal',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--light-color)' }}>
            {/* Left Side - Combo Info */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <Link to="/deals" style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    display: 'inline-block'
                }}>
                    &lt;- Back to Deals
                </Link>

                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    marginTop: '20px'
                }}>
                    <img
                        src={combo.image_url}
                        alt={combo.name}
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h1 style={{ margin: 0, color: 'var(--dark-color)' }}>{combo.name}</h1>
                            <span style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontWeight: 'bold'
                            }}>
                                Save ${combo.savings.toFixed(2)}
                            </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '25px' }}>
                            {combo.description}
                        </p>

                        {/* Items Included */}
                        <h3 style={{ marginBottom: '15px', color: 'var(--dark-color)' }}>What's Included:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            {combo.items.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'var(--light-color)',
                                    padding: '10px 15px',
                                    borderRadius: '12px'
                                }}>
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                                            {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                                        </p>
                                        <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>
                                            ${item.price.toFixed(2)} each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Customization Panel */}
            <div style={{
                width: '450px',
                background: 'white',
                boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
                overflowY: 'auto',
                padding: '30px'
            }}>
                <h2 style={{ marginBottom: '25px', color: 'var(--dark-color)' }}>Customize Your Combo</h2>

                {/* Sauce Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--dark-color)' }}>Choose Your Sauce</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {CUSTOMIZATIONS.sauces.map(sauce => (
                            <button
                                key={sauce.id}
                                onClick={() => setSelectedOptions({ ...selectedOptions, sauce: sauce.id })}
                                style={optionButtonStyle(selectedOptions.sauce === sauce.id)}
                            >
                                {sauce.name} {sauce.price > 0 && `(+$${sauce.price.toFixed(2)})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Side Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--dark-color)' }}>Choose Your Side</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {CUSTOMIZATIONS.sides.map(side => (
                            <button
                                key={side.id}
                                onClick={() => setSelectedOptions({ ...selectedOptions, side: side.id })}
                                style={optionButtonStyle(selectedOptions.side === side.id)}
                            >
                                {side.name} {side.price > 0 && `(+$${side.price.toFixed(2)})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Drink Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--dark-color)' }}>Choose Your Drink</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {CUSTOMIZATIONS.drinks.map(drink => (
                            <button
                                key={drink.id}
                                onClick={() => setSelectedOptions({ ...selectedOptions, drink: drink.id })}
                                style={optionButtonStyle(selectedOptions.drink === drink.id)}
                            >
                                {drink.name} {drink.price > 0 && `(+$${drink.price.toFixed(2)})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selection */}
                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--dark-color)' }}>Choose Size</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {CUSTOMIZATIONS.sizes.map(size => (
                            <button
                                key={size.id}
                                onClick={() => setSelectedOptions({ ...selectedOptions, size: size.id })}
                                style={optionButtonStyle(selectedOptions.size === size.id)}
                            >
                                {size.name} {size.price > 0 && `(+$${size.price.toFixed(2)})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: 'var(--dark-color)' }}>Special Instructions</h4>
                    <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any allergies, preferences, or special requests?"
                        style={{
                            width: '100%',
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid #ddd',
                            fontSize: '1rem',
                            minHeight: '80px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Pricing Summary */}
                <div style={{
                    background: 'var(--light-color)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Combo Price:</span>
                        <span>${combo.combo_price.toFixed(2)}</span>
                    </div>
                    {getExtraPrice() > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--secondary-color)' }}>
                            <span>Customizations:</span>
                            <span>+${getExtraPrice().toFixed(2)}</span>
                        </div>
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem' }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--primary-color)' }}>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 5px 20px rgba(211, 47, 47, 0.3)'
                    }}
                >
                    Add to Cart - ${totalPrice.toFixed(2)}
                </button>
            </div>
        </div>
    );
};

export default ComboDetail;
