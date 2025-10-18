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
        "wind_gusts": data["wind"].get("gust", 0.0),
        "clouds": data["clouds"]["all"],
        "visibility": data["visibility"],
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
    humiditys = []
    wind_speeds = []
    wind_gusts = []
    clouds = []
    visibilitys = []

    for lat, lon in zip(lats.ravel(), lons.ravel()):
        weather = get_weather(lat, lon)
        temps.append(weather["temp"] if weather["temp"] is not None else np.nan)
        humiditys.append(weather["humidity"] if weather["humidity"] is not None else np.nan)
        wind_speeds.append(weather["wind_speed"] if weather["wind_speed"] is not None else np.nan)
        wind_gusts.append(weather["wind_gusts"] if weather["wind_gusts"] is not None else np.nan)
        clouds.append(weather["clouds"] if weather["clouds"] is not None else np.nan)
        visibilitys.append(weather["visibility"] if weather["visibility"] is not None else np.nan)

    temps = np.array(temps).reshape(lats.shape)
    humiditys = np.array(humiditys).reshape(lats.shape)
    wind_speeds = np.array(wind_speeds).reshape(lats.shape)
    wind_gusts = np.array(wind_gusts).reshape(lats.shape)
    clouds = np.array(clouds).reshape(lats.shape)
    visibilitys = np.array(visibilitys).reshape(lats.shape)

    # Plotting the temperature data
    # plt.figure(figsize=(8, 6))
    # plt.contourf(lons, lats, temps, cmap='coolwarm')
    # plt.colorbar(label='Temperature (°C)')
    # plt.title('Temperature Map')
    # plt.xlabel('Longitude')
    # plt.ylabel('Latitude')
    # plt.show()

    return temps, humiditys, wind_speeds, wind_gusts, clouds, visibilitys, lats, lons