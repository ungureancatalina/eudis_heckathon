import React from 'react';

interface WeatherData {
    temperature: string;
    humidity: string;
    windSpeed: string;
}

interface RouteData {
    name: string;
    score: number;
    recommendation: 'Go' | 'No Go';
    weather: WeatherData;
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

                    <h3 style={{
                        color: '#FFFFFF',
                        fontSize: '40px',
                        marginBottom: '24px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {route.name}
                    </h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px'
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

                        <p style={{
                            fontSize: '34px',
                            fontWeight: 'bold',
                            color: route.recommendation === 'Go' ? '#00FF00' : '#FF4500'
                        }}>
                            {route.recommendation}
                        </p>
                    </div>

                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center',
                        fontSize: '22px',
                        color: '#FFFFFF',
                    }}>
                        <thead>
                        <tr>
                            <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>🌡 Temperature</th>
                            <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>💧 Humidity</th>
                            <th style={{ borderBottom: '2px solid #50c0e9', padding: '10px' }}>🌬 Wind Speed</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{ padding: '12px', color: '#FF6347', fontWeight: 'bold' }}>{route.weather.temperature}</td>
                            <td style={{ padding: '12px', color: '#00BFFF', fontWeight: 'bold' }}>{route.weather.humidity}</td>
                            <td style={{ padding: '12px', color: '#7CFC00', fontWeight: 'bold' }}>{route.weather.windSpeed}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
        })}
    </div>
);

export default MissionPanel;
