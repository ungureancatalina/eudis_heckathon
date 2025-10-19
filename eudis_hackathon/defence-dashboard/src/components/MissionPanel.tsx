import React from 'react';

interface WeatherData {
    temperature: string;
    humidity: string;
    windSpeed: string;
    clouds?: number;
    visibility?: number;
    windGust?: number;
    ndvi?: number;
}

interface RouteData {
    name: string;
    score: number;
    recommendation: 'Go' | 'No Go';
    weather: WeatherData;
    points?: { lat: number; lon: number }[];
    tags?: string[];
}

interface MissionPanelProps {
    routes: RouteData[];
    style?: React.CSSProperties;
}

const MissionPanel: React.FC<MissionPanelProps> = ({ routes }) => (
    <div style={{
        flex: 1,
        backgroundImage: 'url("/image2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px',
        padding: '40px',
        display: 'flex',
        minHeight: '640px',
        flexDirection: 'column',
        gap: '40px',
        border: '2px solid #50c0e9',
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
        fontFamily: 'Arial, sans-serif',
    }}>
        <h2 style={{
            color: '#FFFFFF',
            fontSize: '56px',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 0 8px #0097fc',
        }}>
            Mission Panel
        </h2>

        {routes.map((route, idx) => {
            const displayScore = Math.round(route.score * 100);
            return (
                <div key={idx} style={{
                    border: '2px solid #50c0e9',
                    borderRadius: '16px',
                    padding: '40px',
                    minHeight: '280px',
                    width: '85%',
                    maxWidth: '780px',
                    backgroundColor: '#27273c',
                    backgroundImage: route.recommendation === 'Go'
                        ? 'linear-gradient(rgba(0,255,0,0.15), rgba(0,255,0,0.1))'
                        : 'linear-gradient(rgba(255,0,0,0.15), rgba(255,0,0,0.1))',
                    transition: 'transform 0.2s, box-shadow 0.2s, background-image 0.3s',
                    cursor: 'pointer',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
                     onMouseEnter={e => {
                         const target = e.currentTarget;
                         target.style.transform = 'scale(1.04)';
                         target.style.boxShadow = '0 16px 32px rgba(0,151,252,0.5)';
                     }}
                     onMouseLeave={e => {
                         const target = e.currentTarget;
                         target.style.transform = 'scale(1)';
                         target.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                     }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                        gap: '20px'
                    }}>
                        <svg width="80" height="80">
                            <circle cx="40" cy="40" r="32" fill="none" stroke="#444" strokeWidth="8" />
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                fill="none"
                                stroke={`hsl(${displayScore * 120 / 100}, 100%, 50%)`}
                                strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 32}
                                strokeDashoffset={2 * Math.PI * 32 * (1 - displayScore / 100)}
                                strokeLinecap="round"
                                transform="rotate(-90 40 40)"
                            />
                            <text
                                x="40"
                                y="48"
                                textAnchor="middle"
                                fill="#FFD700"
                                fontSize="28px"
                                fontWeight="bold"
                            >
                                {displayScore}
                            </text>
                        </svg>

                        <h3 style={{
                            color: '#FFFFFF',
                            fontSize: '50px',
                            fontWeight: 'bold',
                            margin: 0
                        }}>
                            {route.name}
                        </h3>

                        <p style={{
                            fontSize: '40px',
                            fontWeight: 'bold',
                            justifyContent: 'right',
                            color: route.recommendation === 'Go' ? '#00FF00' : '#FF4500',
                            margin: 0,
                        }}>
                            {route.recommendation}
                        </p>
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px'
                    }}>


                        <table style={{
                            width: '60%',
                            borderCollapse: 'collapse',
                            textAlign: 'center',
                            fontSize: '22px',
                            color: '#FFFFFF',
                            marginBottom: '20px',
                            marginLeft: '20px'
                        }}>
                            <thead>
                            <tr>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Temp</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Humidity</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Wind</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Clouds</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Visibility</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>Wind Gust</th>
                                <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>NDVI</th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#FF6347' }}>{route.weather.temperature}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#00BFFF' }}>{route.weather.humidity}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#7CFC00' }}>{route.weather.windSpeed}</td>
                                <td style={{ padding: '12px', color: '#FFD700', fontWeight: 'bold' }}>{route.weather.clouds}</td>
                                <td style={{ padding: '12px', color: '#FF69B4', fontWeight: 'bold' }}>{route.weather.visibility}</td>
                                <td style={{ padding: '12px', color: '#ADFF2F', fontWeight: 'bold' }}>{route.weather.windGust}</td>
                                <td style={{ padding: '12px', color: '#32CD32', fontWeight: 'bold' }}>{route.weather.ndvi}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {route.tags && route.tags.length > 0 && (
                        <div style={{
                            marginTop: '16px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            {route.tags.map((tag, i) => (
                                <span key={i} style={{
                                    backgroundColor: '#50c0e9',
                                    color: '#1a1a2f',
                                    fontWeight: 'bold',
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontSize: '20px',
                                    textAlign: 'center'
                                }}>
                            {tag}
                        </span>
                            ))}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);
export default MissionPanel;
