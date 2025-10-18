import React from 'react';

const Header: React.FC = () => (
    <header style={{
        padding: '16px',
        textAlign: 'center',
        backgroundImage: 'url(/image1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff',
        borderBottom: '2px solid #50c0e9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
        <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            textShadow: '0 0 8px #0097fc',
        }}>
            AeroMind - Defence Dashboard
        </h1>
    </header>
);

export default Header;
