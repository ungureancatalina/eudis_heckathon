export interface Coordinates {
    start_lat: number;
    start_lon: number;
    end_lat: number;
    end_lon: number;
}

export interface RoutePoint {
    lat: number;
    lon: number;
}

export interface RouteResponse {
    points: RoutePoint[];
    [key: string]: any;
}

const BASE_URL = 'http://192.168.1.139:5000';

export const getRoute = async (coords: Coordinates): Promise<RouteResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/calculate_route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coords),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: RouteResponse = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to fetch route:', error);
        throw error;
    }
};
