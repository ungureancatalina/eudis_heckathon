import React from 'react';
import type { Coordinates } from '../services/api';

interface CoordinateBarProps {
    startPoint: { lat: number; lon: number } | null;
    endPoint: { lat: number; lon: number } | null;
    setStartPoint: (pt: { lat: number; lon: number } | null) => void;
    setEndPoint: (pt: { lat: number; lon: number } | null) => void;
    onSend?: (coords: Coordinates) => void;
}

const CoordinateBar: React.FC<CoordinateBarProps> = ({
                                                         startPoint,
                                                         endPoint,
                                                         setStartPoint,
                                                         setEndPoint,
                                                         onSend,
                                                     }) => {
    const inputStyle = {
        marginLeft: '20px',
        width: '100px',
        fontSize: '18px',
        padding: '4px 16px',
        borderRadius: '4px',
        border: '2px solid #50c0e9',
        backgroundColor: '#1e1e2f',
        color: '#fff',
    };

    const labelStyle = { fontSize: '28px', fontWeight: 'bold' };

    const handleClear = () => {
        setStartPoint(null);
        setEndPoint(null);
    };

    const handleSend = () => {
        if (!startPoint || !endPoint) return;
        onSend?.({
            start_lat: startPoint.lat,
            start_lon: startPoint.lon,
            end_lat: endPoint.lat,
            end_lon: endPoint.lon,
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '14px',
                backgroundImage: 'url("/image.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                borderRadius: '8px',
                border: '2px solid #50c0e9',
                color: '#fff',
                marginBottom: '8px',
            }}
        >
            <div style={{marginLeft: '20px'}}>
                <label style={labelStyle}>Start Latitude:</label>
                <input
                    type="number"
                    value={startPoint?.lat ?? ''}
                    onChange={(e) =>
                        setStartPoint(e.target.value ? { lat: parseFloat(e.target.value), lon: startPoint?.lon ?? 0 } : null)
                    }
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>Start Longitude:</label>
                <input
                    type="number"
                    value={startPoint?.lon ?? ''}
                    onChange={(e) =>
                        setStartPoint(e.target.value ? { lat: startPoint?.lat ?? 0, lon: parseFloat(e.target.value) } : null)
                    }
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>End Latitude:</label>
                <input
                    type="number"
                    value={endPoint?.lat ?? ''}
                    onChange={(e) =>
                        setEndPoint(e.target.value ? { lat: parseFloat(e.target.value), lon: endPoint?.lon ?? 0 } : null)
                    }
                    style={inputStyle}
                />
            </div>
            <div>
                <label style={labelStyle}>End Longitude:</label>
                <input
                    type="number"
                    value={endPoint?.lon ?? ''}
                    onChange={(e) =>
                        setEndPoint(e.target.value ? { lat: endPoint?.lat ?? 0, lon: parseFloat(e.target.value) } : null)
                    }
                    style={inputStyle}
                />
            </div>

            <button
                onClick={handleClear}
                style={{
                    backgroundColor: '#1a1a2f',
                    border: '2px solid #00bfff',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginLeft: "40px",
                }}
                onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = '#00bfff';
                    target.style.color = '#1a1a2f';
                }}
                onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = '#1a1a2f';
                    target.style.color = '#fff';
                }}
            >
                Clear
            </button>

            <button
                onClick={handleSend}
                style={{
                    backgroundColor: '#1a1a2f',
                    border: '2px solid #00bfff',
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = '#00bfff';
                    target.style.color = '#1a1a2f';
                }}
                onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.backgroundColor = '#1a1a2f';
                    target.style.color = '#fff';
                }}
            >
                Send
            </button>
        </div>
    );
};

export default CoordinateBar;
