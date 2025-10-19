import React, { useState } from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
import MissionPanel from '../components/MissionPanel';
import CoordinateBar from '../components/CoordinateBar';
import DroneList from '../components/DroneList';
import type { Coordinates, RoutePoint } from '../services/api';
import { getRoute } from '../services/api';
import TypingText from "../components/TypingText.tsx";

interface BackendResponse {
    averages: {
        clouds: number;
        humid: number;
        risk_score: number;
        temp: number;
        visibility: number;
        wind_gust: number;
        wind_speed: number;
        ndvi: number;
    };
    recommendation: 'Go' | 'No Go';
    route: [number, number][];
    tags: string[];
}

interface WeatherData {
    temperature: string;
    humidity: string;
    windSpeed: string;
    clouds?: number;
    visibility?: number;
    windGust?: number;
    ndvi: number;
}

interface RouteData {
    name: string;
    score: number;
    recommendation: 'Go' | 'No Go';
    weather: WeatherData;
    points?: { lat: number; lon: number }[];
    tags?: string[];
}

const Dashboard: React.FC = () => {
    const [startPoint, setStartPoint] = useState<{ lat: number; lon: number } | null>(null);
    const [endPoint, setEndPoint] = useState<{ lat: number; lon: number } | null>(null);
    const [droneRoutes, setDroneRoutes] = useState<Record<string, RoutePoint[]>>({});
    const [missionData, setMissionData] = useState<RouteData[]>([]);
    const [visibleRoutes, setVisibleRoutes] = useState<Record<string, RoutePoint[]>>({});
    const [selectedDrone, setSelectedDrone] = useState<string | undefined>(undefined);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [pendingCoords, setPendingCoords] = useState<Coordinates | null>(null);
    const [droneNameInput, setDroneNameInput] = useState<string | null>(null);
    const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
    const [updatingMission, setUpdatingMission] = useState(false);

    const militaryBases = [
        { name: "Câmpia Turzii Air Base (71st Air Base)", lat: 46.516, lon: 23.883 },
        { name: "Mihail Kogălniceanu Air Base", lat: 44.353, lon: 28.488 },
        { name: "Fetești Air Base (86th Air Base)", lat: 44.385, lon: 27.742 },
        { name: "Deveselu Aegis Ballistic Missile Defense Base", lat: 44.074, lon: 24.374 },
        { name: "Boboc Air Base (95th Air Base)", lat: 45.149, lon: 26.967 },
        { name: "Cincu Military Training Area", lat: 45.855, lon: 24.976 },
        { name: "Smârdan Training Range", lat: 45.553, lon: 27.907 },
        { name: "Borcea Airfield", lat: 44.35, lon: 27.733 },
        { name: "Timișoara Giarmata Airfield", lat: 45.809, lon: 21.337 },
        { name: "Otopeni (90th Airlift Base)", lat: 44.572, lon: 26.085 },
        { name: "Kecskemét Air Base, Hungary", lat: 46.896, lon: 19.702 },
        { name: "Szolnok Air Base, Hungary", lat: 47.194, lon: 20.180 },
        { name: "Aviano Air Base, Italy", lat: 46.010, lon: 12.632 },
        { name: "Grafenwöhr Training Area, Germany", lat: 49.685, lon: 11.755 },
        { name: "Chaţeneau Air Base (?), Moldova", lat: 47.055, lon: 28.863 },
    ];

    const handleSendCoords = (coords: Coordinates) => {
        setPendingCoords(coords);
        setDroneNameInput('');
    };

    const handleDroneSelect = async (droneId: string) => {
        setSelectedDrone(droneId);
        setUpdatingMission(true);

        const existingRoute = droneRoutes[droneId];
        if (existingRoute) {
            setVisibleRoutes({ [droneId]: existingRoute });
        }

        if (!existingRoute || existingRoute.length < 2) {
            console.warn(`No route found for drone ${droneId}`);
            setOverlayMessage('No route data available for this drone');
            setTimeout(() => setOverlayMessage(null), 3000);
            return;
        }

        try {
            const start = existingRoute[0];
            const end = existingRoute[existingRoute.length - 1];

            const coords = {
                start_lat: start.lat,
                start_lon: start.lon,
                end_lat: end.lat,
                end_lon: end.lon,
            };

            console.log('Sending coordinates to backend:', coords);

            const data = await getRoute(coords);

            const backendData = data as unknown as BackendResponse;
            const points: RoutePoint[] = backendData.route.map(([lat, lon]) => ({ lat, lon }));

            const missionRoute: RouteData = {
                name: droneId,
                score: backendData.averages.risk_score,
                recommendation: backendData.recommendation,
                weather: {
                    temperature: `${backendData.averages.temp.toFixed(1)}°C`,
                    humidity: `${backendData.averages.humid}%`,
                    windSpeed: `${backendData.averages.wind_speed.toFixed(1)} m/s`,
                    clouds: backendData.averages.clouds,
                    visibility: backendData.averages.visibility,
                    windGust: backendData.averages.wind_gust,
                    ndvi: backendData.averages.ndvi
                },
                points,
                tags: backendData.tags
            };

            setMissionData([missionRoute]);
            setDroneRoutes(prev => ({ ...prev, [droneId]: points }));
            setVisibleRoutes({ [droneId]: points });

        } catch (err) {
            console.error(err);
            setOverlayMessage('Failed to fetch route for this drone');
            setTimeout(() => setOverlayMessage(null), 5000);
        } finally {
            setUpdatingMission(false);
        }
    };



    const sendDroneRoute = async (droneName: string, coords: Coordinates) => {
        setLoadingRoute(true);
        try {
            const data = await getRoute(coords);
            if (!data || !('route' in data) || !('averages' in data)) {
                setOverlayMessage('Invalid response from server');
                setTimeout(() => setOverlayMessage(null), 5000);
                return;
            }

            const backendData = data as unknown as BackendResponse;
            const points: RoutePoint[] = backendData.route.map(([lat, lon]) => ({ lat, lon }));

            const missionRoute: RouteData = {
                name: droneName,
                score: backendData.averages.risk_score,
                recommendation: backendData.recommendation,
                weather: {
                    temperature: `${backendData.averages.temp.toFixed(1)}°C`,
                    humidity: `${backendData.averages.humid}%`,
                    windSpeed: `${backendData.averages.wind_speed.toFixed(1)} m/s`,
                    clouds: backendData.averages.clouds,
                    visibility: backendData.averages.visibility,
                    windGust: backendData.averages.wind_gust,
                    ndvi: backendData.averages.ndvi,
                },
                points
            };

            setDroneRoutes(prev => ({ ...prev, [droneName]: points }));
            setMissionData([missionRoute]);
            setVisibleRoutes({ [droneName]: points });
            setSelectedDrone(droneName);
        } catch (err) {
            console.error(err);
            setOverlayMessage('The distance between points should be bigger than 1.2km');
            setTimeout(() => setOverlayMessage(null), 5000);
        } finally {
            setLoadingRoute(false);
            setPendingCoords(null);
            setDroneNameInput(null);
        }
    };

    const handleShowAllDrones = () => {
        setVisibleRoutes(droneRoutes);
        setSelectedDrone(undefined);
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
                        onSend={handleSendCoords}
                    />
                    <MapView
                        startPoint={startPoint}
                        endPoint={endPoint}
                        setStartPoint={setStartPoint}
                        setEndPoint={setEndPoint}
                        routes={visibleRoutes}
                        loading={loadingRoute}
                        militaryBases={militaryBases}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <MissionPanel routes={missionData} style={{ flex: 1 }} />

                        {updatingMission && (
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
                                <TypingText text="Updating mission data..." speed={80} />
                            </div>
                        )}
                    </div>
                    <DroneList
                        drones={Object.keys(droneRoutes).map(id => ({ id, name: id, route: droneRoutes[id] || [] }))}
                        selectedDroneId={selectedDrone}
                        onSelect={handleDroneSelect}
                        onShowAll={handleShowAllDrones}
                        onDelete={(id) => {
                            const newRoutes = { ...droneRoutes };
                            delete newRoutes[id];
                            setDroneRoutes(newRoutes);
                            setMissionData(prev => prev.filter(m => m.name !== id));
                            if (selectedDrone === id) {
                                setSelectedDrone(undefined);
                                setVisibleRoutes({});
                            }
                        }}
                        onUpdateRoute={async (id) => {
                            if (!startPoint || !endPoint) return;
                            const coords = { start_lat: startPoint.lat, start_lon: startPoint.lon, end_lat: endPoint.lat, end_lon: endPoint.lon };
                            const data = await getRoute(coords);
                            if (!data || !('route' in data) || !('averages' in data) || !('recommendation' in data)) {
                                setOverlayMessage('Invalid response from server');
                                setTimeout(() => setOverlayMessage(null), 5000);
                                return;
                            }
                            const backendData = data as unknown as BackendResponse;
                            const points: RoutePoint[] = backendData.route.map(([lat, lon]) => ({ lat, lon }));
                            const missionRoute: RouteData = {
                                name: id,
                                score: backendData.averages.risk_score,
                                recommendation: backendData.recommendation,
                                weather: {
                                    temperature: `${backendData.averages.temp.toFixed(1)}°C`,
                                    humidity: `${backendData.averages.humid}%`,
                                    windSpeed: `${backendData.averages.wind_speed.toFixed(1)} m/s`,
                                    clouds: backendData.averages.clouds,
                                    visibility: backendData.averages.visibility,
                                    windGust: backendData.averages.wind_gust,
                                    ndvi: backendData.averages.ndvi,
                                },
                                points
                            };
                            setDroneRoutes(prev => ({ ...prev, [id]: points }));
                            setMissionData(prev => {
                                const other = prev.filter(m => m.name !== id);
                                return [...other, missionRoute];
                            });
                            setVisibleRoutes({ [id]: points });
                            setSelectedDrone(id);
                        }}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            {droneNameInput !== null && pendingCoords && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: '#1a1a2f',
                        padding: '60px',
                        borderRadius: '16px',
                        border: '2px solid #50c0e9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px',
                        alignItems: 'center'
                    }}>
                        <h2 style={{
                            fontSize: '42px',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px #0097fc',
                            textAlign: 'center'
                        }}>
                            Enter Drone Name:
                        </h2>
                        <input
                            type="text"
                            value={droneNameInput}
                            onChange={e => setDroneNameInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && droneNameInput?.trim() && pendingCoords) {
                                    const coordsToSend = pendingCoords;
                                    const droneNameToSend = droneNameInput.trim();
                                    setDroneNameInput(null);
                                    sendDroneRoute(droneNameToSend, coordsToSend);
                                }
                            }}
                            style={{
                                fontSize: '32px',
                                padding: '16px 32px',
                                borderRadius: '10px',
                                border: '2px solid #50c0e9',
                                backgroundColor: '#27273c',
                                color: '#fff',
                                width: '400px',
                                textAlign: 'center'
                            }}
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {overlayMessage && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: '#ffcc00', fontSize: '36px', fontWeight: 'bold',
                    zIndex: 3000, textAlign: 'center', padding: '20px'
                }}>
                    {overlayMessage}
                </div>
            )}
        </div>
    );
};

export default Dashboard;