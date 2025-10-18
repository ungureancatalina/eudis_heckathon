import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { RoutePoint } from '../services/api';

interface MapViewProps {
    startPoint: { lat: number; lon: number } | null;
    endPoint: { lat: number; lon: number } | null;
    setStartPoint: (pt: { lat: number; lon: number } | null) => void;
    setEndPoint: (pt: { lat: number; lon: number } | null) => void;
    routePoints: RoutePoint[];
    loading?: boolean;
}

const redMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const MapView: React.FC<MapViewProps> = ({ startPoint, endPoint, setStartPoint, setEndPoint, routePoints, loading }) => {
    const MapClickHandler = () => {
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

    return (
        <div style={{ flex: 2, borderRadius: '12px', border: '2px solid #50c0e9', overflow: 'hidden' }}>
            <MapContainer
                center={startPoint ? [startPoint.lat, startPoint.lon] : [46.766490, 23.596237]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
                />

                <MapClickHandler />

                {startPoint && <Marker position={[startPoint.lat, startPoint.lon]} icon={redMarkerIcon} />}
                {endPoint && <Marker position={[endPoint.lat, endPoint.lon]} icon={redMarkerIcon} />}

                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints.map(p => [p.lat, p.lon])} // include toate punctele
                        color="red"
                        weight={5}
                    />
                )}

                {routePoints.length > 0 && (
                    <>
                        <Marker position={[routePoints[0].lat, routePoints[0].lon]} icon={redMarkerIcon}>
                            <Popup>Start point</Popup>
                        </Marker>

                        <Marker
                            position={[routePoints[routePoints.length - 1].lat, routePoints[routePoints.length - 1].lon]}
                            icon={redMarkerIcon}
                        >
                            <Popup>End point</Popup>
                        </Marker>
                    </>
                )}


            </MapContainer>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#FFD700',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    zIndex: 1000,
                }}>
                    Calculating Route...
                </div>
            )}
        </div>
    );
};

export default MapView;
