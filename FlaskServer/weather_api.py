import requests
import os
from dotenv import load_dotenv
import numpy as np
import matplotlib.pyplot as plt
from geopy.distance import geodesic


load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_weather(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        return {"error": "Failed to fetch weather"}
    data = response.json()

    # Extract relevant info
    weather_info = {
        "temp": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"]
    }
    return weather_info


def get_weather_data(lat, lon):
    params = {
        'lat': lat,
        'lon': lon,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric'  # Temperature in Celsius
    }
    API_URL = 'https://api.openweathermap.org/data/2.5/weather'

    response = requests.get(API_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        return data['main']['temp']  # Return temperature
    else:
        print(f"Error fetching data for {lat}, {lon}")
        return None

# Function to generate a grid of coordinates
def generate_grid(start_lat, start_lon, end_lat, end_lon, spacing_km=1):
    # Calculate the number of steps in each direction
    distance = geodesic((start_lat, start_lon), (end_lat, end_lon)).km
    num_steps = int(distance // spacing_km)

    # Generate grid of coordinates
    lats = np.linspace(start_lat, end_lat, num_steps)
    lons = np.linspace(start_lon, end_lon, num_steps)
    return np.array(np.meshgrid(lats, lons))

def get_grid(start_lat, start_lon, end_lat, end_lon):
    # Generate the grid
    lats, lons = generate_grid(start_lat, start_lon, end_lat, end_lon)

    # Fetch weather data for each point on the grid
    temps = []
    for lat, lon in zip(lats.ravel(), lons.ravel()):
        temp = get_weather_data(lat, lon)
        temps.append(temp if temp is not None else np.nan)

    temps = np.array(temps).reshape(lats.shape)

    # Plotting the temperature data
    # plt.figure(figsize=(8, 6))
    # plt.contourf(lons, lats, temps, cmap='coolwarm')
    # plt.colorbar(label='Temperature (°C)')
    # plt.title('Temperature Map')
    # plt.xlabel('Longitude')
    # plt.ylabel('Latitude')
    # plt.show()

    return temps, lats, lons