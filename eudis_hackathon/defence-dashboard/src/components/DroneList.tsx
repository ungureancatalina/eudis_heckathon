import React, { useState } from 'react';
import type { RoutePoint } from '../services/api';

export interface DroneData {
    id: string;
    name: string;
    route: RoutePoint[];
}

interface DroneListProps {
    drones: DroneData[];
    style?: React.CSSProperties;
    onSelect?: (id: string) => void;
    onDelete?: (id: string) => void;
    onUpdateRoute?: (id: string) => void;
    onShowAll?: () => void;
    selectedDroneId?: string;
}

const DroneList: React.FC<DroneListProps> = ({ drones, onSelect, onDelete, onShowAll, selectedDroneId }) => {
    const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

    const handleDelete = () => {
        if (!selectedDroneId) {
            setOverlayMessage('Choose a drone from the list...');
            setTimeout(() => setOverlayMessage(null), 5000);
            return;
        }
        onDelete?.(selectedDroneId);
    };

    const handleShowAll = () => {
        if (drones.length === 0) return;
        onShowAll?.();
        setOverlayMessage('Showing all drones on map!');
        setTimeout(() => setOverlayMessage(null), 5000);
    };

    return (
        <div style={{ flex: 1, border: '2px solid #50c0e9', borderRadius: '16px', padding: '16px', backgroundImage: 'url("/image3.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', position: 'relative' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '56px', fontWeight: 'bold', textAlign: 'center', textShadow: '0 0 8px #0097fc' }}>Active Drones</h3>

            {drones.map((drone) => (
                <div
                    key={drone.id}
                    onClick={() => onSelect?.(drone.id)}
                    style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor: drone.id === selectedDroneId ? '#3355aa' : '#1a1a2f',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
                    }}
                    onMouseOver={(e) => {
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


            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', justifyContent: 'center', paddingTop: '12px' }}>

                <button onClick={handleDelete} style={{
                    backgroundColor: '#1a1a2f',
                    border: '2px solid #00bfff',
                    color: '#fff',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginLeft: '20px',
                }}
                    onMouseOver={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'scale(1.1)';
                    target.style.backgroundColor = '#113d93';
                    target.style.boxShadow = '0 12px 24px rgba(0,151,252,0.5)';
                }}
                    onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.transform = 'scale(1)';
                    target.style.backgroundColor = '#1a1a2f';
                    target.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                }}>
                    Delete Drone
                </button>
                <button onClick={handleShowAll} style={{
                    backgroundColor: '#1a1a2f',
                    border: '2px solid #00bfff',
                    color: '#fff',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginLeft: '20px',
                }}
                        onMouseOver={(e) => {
                            const target = e.currentTarget;
                            target.style.transform = 'scale(1.1)';
                            target.style.backgroundColor = '#113d93';
                            target.style.boxShadow = '0 12px 24px rgba(0,151,252,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            const target = e.currentTarget;
                            target.style.transform = 'scale(1)';
                            target.style.backgroundColor = '#1a1a2f';
                            target.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                        }}>
                    Show All Drones
                </button>
            </div>

            {overlayMessage && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#eeff00',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    textAlign: 'center'
                }}>
                    {overlayMessage}
                </div>
            )}
        </div>
    );
};

export default DroneList;
