import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, Popup , LayersControl } from 'react-leaflet';
import L from 'leaflet';
import type { RoutePoint } from '../services/api';
import TypingText from './TypingText';


const { BaseLayer } = LayersControl;

interface MapViewProps {
    startPoint: { lat: number; lon: number } | null;
    endPoint: { lat: number; lon: number } | null;
    setStartPoint: (pt: { lat: number; lon: number } | null) => void;
    setEndPoint: (pt: { lat: number; lon: number } | null) => void;
    routes?: Record<string, RoutePoint[]>;
    loading?: boolean;
    animatedDroneId?: string;
}

const lineColors = ['red', 'blue', 'green', 'orange', 'purple', 'cyan', 'magenta'];

const tempIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [35, 55],
    iconAnchor: [17, 55],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/leaflet-shadow.png',
    shadowSize: [41, 41],
});

const AnimatedSegments: React.FC<{ points: RoutePoint[], color: string }> = ({ points, color }) => {
    const [segments, setSegments] = useState<[number, number][][]>([]);

    useEffect(() => {
        setSegments([]);
        let i = 0;
        const interval = setInterval(() => {
            if (i >= points.length - 1) {
                clearInterval(interval);
                return;
            }
            setSegments(prev => [...prev, [
                [points[i].lat, points[i].lon],
                [points[i + 1].lat, points[i + 1].lon]
            ]]);
            i++;
        }, 100);
        return () => clearInterval(interval);
    }, [points]);

    return (
        <>
            {segments.map((seg, idx) => (
                <Polyline key={idx} positions={seg} pathOptions={{ color, weight: 6, dashArray: '10,10' }} />
            ))}
        </>
    );
};

const MapClickHandler: React.FC<{
    startPoint: { lat: number; lon: number } | null;
    endPoint: { lat: number; lon: number } | null;
    setStartPoint: (pt: { lat: number; lon: number } | null) => void;
    setEndPoint: (pt: { lat: number; lon: number } | null) => void;
}> = ({ startPoint, endPoint, setStartPoint, setEndPoint }) => {
    useMapEvents({
        click(e) {
            if (!startPoint) {
                setStartPoint({ lat: e.latlng.lat, lon: e.latlng.lng });
            } else if (!endPoint) {
                setEndPoint({ lat: e.latlng.lat, lon: e.latlng.lng });
            } else {
                setStartPoint({ lat: e.latlng.lat, lon: e.latlng.lng });
                setEndPoint(null);
            }
        }
    });
    return null;
};


const MapView: React.FC<MapViewProps> = ({ startPoint, endPoint, setStartPoint, setEndPoint, routes, loading, animatedDroneId }) => {
    return (
        <div style={{ flex: 2, borderRadius: '12px', border: '2px solid #50c0e9', overflow: 'hidden', position: 'relative' }}>
            <MapContainer
                center={startPoint ? [startPoint.lat, startPoint.lon] : [46.766490, 23.596237]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <LayersControl position="topright">
                    <BaseLayer checked name="Topographic">
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenTopoMap contributors'
                        />
                    </BaseLayer>

                    <BaseLayer name="Street">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                    </BaseLayer>
                </LayersControl>

                <MapClickHandler startPoint={startPoint} endPoint={endPoint} setStartPoint={setStartPoint} setEndPoint={setEndPoint} />

                {startPoint && <Marker position={[startPoint.lat, startPoint.lon]} icon={tempIcon}><Popup>Start Temp</Popup></Marker>}
                {endPoint && <Marker position={[endPoint.lat, endPoint.lon]} icon={tempIcon}><Popup>End Temp</Popup></Marker>}

                {routes && Object.entries(routes).map(([droneId, points], idx) => {
                    const color = lineColors[idx % lineColors.length];
                    return (
                        <React.Fragment key={droneId}>
                            {animatedDroneId === droneId
                                ? <AnimatedSegments points={points} color={color} />
                                : points.map((point, i) => {
                                    if (i === points.length - 1) return null;
                                    const segment: L.LatLngTuple[] = [
                                        [point.lat, point.lon] as L.LatLngTuple,
                                        [points[i + 1].lat, points[i + 1].lon] as L.LatLngTuple
                                    ];
                                    return <Polyline key={i} positions={segment} pathOptions={{ color, weight: 6 }} />;
                                })
                            }

                            {points.length > 0 && (
                                <>
                                    <Marker position={[points[0].lat, points[0].lon]} icon={startIcon}>
                                        <Popup>{droneId} Start</Popup>
                                    </Marker>
                                    <Marker position={[points[points.length - 1].lat, points[points.length - 1].lon]} icon={endIcon}>
                                        <Popup>{droneId} End</Popup>
                                    </Marker>
                                </>
                            )}
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            <div style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                backgroundColor: 'rgba(30,30,47,0.85)',
                padding: '10px 16px',
                borderRadius: '12px',
                color: '#fff',
                zIndex: 2000,
                fontFamily: 'monospace',
                maxHeight: '50%',
                overflowY: 'auto',
            }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '40px', textAlign: 'center' }}>Legend</div>
                {routes && Object.keys(routes).map((droneId, idx) => (
                    <div key={'legend-' + droneId} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{
                            width: '30px',
                            height: '7px',
                            backgroundColor: lineColors[idx % lineColors.length],
                            marginRight: '8px'
                        }} />
                        <span style={{ fontSize: '25px', }}>{droneId}</span>
                    </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="start" style={{ width: '25px', marginRight: '6px' }} />
                    <span style={{ fontSize: '25px', }}>Start</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="end" style={{ width: '25px', marginRight: '6px' }} />
                    <span style={{ fontSize: '25px', }}>End</span>
                </div>
            </div>

            {loading && (
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
                    <TypingText text="CALCULATING ROUTE..." speed={80} />
                </div>
            )}
        </div>
    );
};

export default MapView;