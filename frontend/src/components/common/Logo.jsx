import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'medium', showText = true, color = 'primary' }) => {
  const sizes = {
    small: { width: 30, height: 30, fontSize: '1.2rem' },
    medium: { width: 45, height: 45, fontSize: '1.8rem' },
    large: { width: 60, height: 60, fontSize: '2.5rem' },
  };

  const currentSize = sizes[size] || sizes.medium;
  const logoColor = color === 'primary' ? '#D32F2F' : color === 'white' ? '#FFFFFF' : '#3E2723';

  return (
    <Link
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Logo SVG Icon */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plate/Circle Base */}
        <circle cx="30" cy="30" r="28" fill={logoColor} opacity="0.1" />
        <circle cx="30" cy="30" r="24" stroke={logoColor} strokeWidth="2" fill="none" />
        
        {/* Fork */}
        <path
          d="M20 15 L20 35 M18 15 L22 15 M18 17 L22 17"
          stroke={logoColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Knife */}
        <path
          d="M40 15 L40 35 M38 15 L42 15 M38 17 L42 17"
          stroke={logoColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Food/Steam lines */}
        <path
          d="M25 25 Q30 20 35 25"
          stroke={logoColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M23 30 Q30 25 37 30"
          stroke={logoColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M25 35 Q30 30 35 35"
          stroke={logoColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Logo Text */}
      {showText && (
        <span
          style={{
            fontSize: currentSize.fontSize,
            fontWeight: '900',
            color: logoColor,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: 'var(--font-family)',
          }}
        >
          Foodie
        </span>
      )}
    </Link>
  );
};

export default Logo;

