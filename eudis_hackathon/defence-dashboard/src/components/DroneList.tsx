import React from 'react';

export interface DroneData {
    id: string;
    name: string;
}

interface DroneListProps {
    drones: DroneData[];
    style?: React.CSSProperties;
    onSelect?: (id: string) => void;
    selectedDroneId?: string;
}

const DroneList: React.FC<DroneListProps> = ({ drones, onSelect, selectedDroneId }) => {
    return (
        <div
            style={{
                flex: 1,
                border: '2px solid #50c0e9',
                borderRadius: '16px',
                padding: '16px',
                backgroundImage: 'url("/image3.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
            }}
        >
            <h3
                style={{
                    color: '#FFFFFF',
                    fontSize: '56px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '0 0 8px #0097fc',
                }}
            >
                Active Drones
            </h3>

            {drones.map((drone) => (
                <div
                    key={drone.id}
                    onClick={() => onSelect?.(drone.id)}
                    style={{
                        padding: '12px 16px',
                        width: '90%',
                        marginLeft: '20px',
                        height: '60px',
                        borderRadius: '16px',
                        backgroundColor:
                            drone.id === selectedDroneId ? '#0057ff' : '#1a1a2f',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.transform = 'scale(1.04)';
                        target.style.boxShadow = '0 12px 24px rgba(0,151,252,0.5)';
                    }}
                    onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.transform = 'scale(1)';
                        target.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                    }}
                >
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}>{drone.name}</span>
                    <span style={{ fontSize: '30px', color: '#50c0e9' }}>{drone.id}</span>
                </div>
            ))}
        </div>
    );
};

export default DroneList;
