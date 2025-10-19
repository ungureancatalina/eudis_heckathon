import numpy as np
from geopy.distance import geodesic
from global_constants import ROUTE_RESOLUTION
import math
from geopy.distance import distance
from geopy import Point

def generate_grid(start_lat, start_lon, end_lat, end_lon, spacing_km= ROUTE_RESOLUTION):
    # Calculate the number of steps in each direction
    distance = geodesic((start_lat, start_lon), (end_lat, end_lon)).km
    num_steps = int(distance / spacing_km)

    # Generate grid of coordinates
    lats = np.linspace(start_lat, end_lat, num_steps)
    lons = np.linspace(start_lon, end_lon, num_steps)
    return np.array(np.meshgrid(lats, lons))

# def move_point(lat, lon, distance_m, bearing_deg):
#     R = 6371000  # Earth radius in meters
#     bearing = math.radians(bearing_deg)
#     lat1 = math.radians(lat)
#     lon1 = math.radians(lon)
#
#     lat2 = math.asin(
#         math.sin(lat1) * math.cos(distance_m / R) +
#         math.cos(lat1) * math.sin(distance_m / R) * math.cos(bearing)
#     )
#     lon2 = lon1 + math.atan2(
#         math.sin(bearing) * math.sin(distance_m / R) * math.cos(lat1),
#         math.cos(distance_m / R) - math.sin(lat1) * math.sin(lat2)
#     )
#
#     return math.degrees(lat2), math.degrees(lon2)

def move_point_2(lat, lon, distance_m, bearing_deg):
    new_point = distance(kilometers=(distance_m/1000)).destination(Point(lat, lon), bearing_deg)
    return new_point.latitude, new_point.longitude

def bearing_between(lat1, lon1, lat2, lon2):
    import math

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1

    x = math.sin(dlon) * math.cos(lat2)
    y = math.cos(lat1)*math.sin(lat2) - math.sin(lat1)*math.cos(lat2)*math.cos(dlon)
    bearing = math.degrees(math.atan2(x, y))
    return (bearing + 360) % 360  # Normalize to [0,360)