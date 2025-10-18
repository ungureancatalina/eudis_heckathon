import React, { useState } from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
import MissionPanel from '../components/MissionPanel';
import CoordinateBar from '../components/CoordinateBar';
import DroneList from '../components/DroneList';
import type { Coordinates, RoutePoint } from '../services/api';
import { getRoute } from '../services/api';

const Dashboard: React.FC = () => {
    const [startPoint, setStartPoint] = useState<{ lat: number; lon: number } | null>(null);
    const [endPoint, setEndPoint] = useState<{ lat: number; lon: number } | null>(null);
    const [droneRoutes, setDroneRoutes] = useState<Record<string, RoutePoint[]>>({});
    const [selectedDrone, setSelectedDrone] = useState<string | undefined>(undefined);
    const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
    const [loadingRoute, setLoadingRoute] = useState(false);


    const handleSend = async (coords: Coordinates) => {
        setLoadingRoute(true);
        try {
            const data = await getRoute(coords);
            console.log('%cRăspuns de la server:', 'color:#4aff6b;', data);

            // Verificăm data.route în loc de data.points
            if (data && Array.isArray(data.route)) {
                const points: RoutePoint[] = data.route.map((p: [number, number]) => ({
                    lat: p[0],
                    lon: p[1],
                }));

                const newDroneRoutes: Record<string, RoutePoint[]> = { 'drone-001': points };
                setDroneRoutes(newDroneRoutes);

                setSelectedDrone('drone-001');
                setRoutePoints(points);
            } else {
                console.warn('⚠ Serverul nu a trimis un array valid de puncte');
            }
        } catch (err) {
            console.error('Eroare la cererea către server:', err);
        }
        finally {
            setLoadingRoute(false);
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e2f', fontFamily: 'monospace' }}>
            <Header />

            <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <CoordinateBar
                        startPoint={startPoint}
                        endPoint={endPoint}
                        setStartPoint={setStartPoint}
                        setEndPoint={setEndPoint}
                        onSend={handleSend}
                    />

                    <MapView
                        startPoint={startPoint}
                        endPoint={endPoint}
                        setStartPoint={setStartPoint}
                        setEndPoint={setEndPoint}
                        routePoints={routePoints}
                        loading={loadingRoute}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <MissionPanel
                        routes={[
                            {
                                name: "Safest Path",
                                score: 0.88,
                                recommendation: "Go",
                                weather: {
                                    temperature: "22°C",
                                    humidity: "55%",
                                    windSpeed: "10 km/h",
                                },
                            },
                        ]}
                        style={{ flex: 1 }}
                    />

                    <DroneList
                        drones={Object.keys(droneRoutes).map(id => ({ id, name: id }))}
                        selectedDroneId={selectedDrone}
                        onSelect={(id) => {
                            setSelectedDrone(id);
                            setRoutePoints(droneRoutes[id] || []);
                        }}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
