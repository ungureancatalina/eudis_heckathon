from risk_model import calculate_risk
from geopy.distance import geodesic
from functools import lru_cache


from real_world_to_softweare_utils import bearing_between, move_point_2
from weather_api import get_grid
from sentinelhub_utils import get_ndvi_grid
from weather_api import get_weather
from sentinelhub_utils import get_ndvi
from global_constants import ROUTE_RESOLUTION

class Node:
    def __init__(self, lat, lon,temp, humidity, wind_speed, wind_gust, clouds, visibility, ndvi):
        self.lat = lat
        self.lon = lon

        self.temp = temp
        self.humid = humidity
        self.wind_speed = wind_speed
        self.wind_gust = wind_gust
        self.clouds = clouds
        self.visibility = visibility

        self.ndvi = ndvi

        self.risk_score = 1

        self.tags = []

        if wind_speed > 10:
            #self.risk_score *= 0.8
            self.tags.append('HIGH WIND SPEED')
            if wind_speed > 15:
                #self.risk_score *= 0.8
                self.tags.append('EXTREME WIND SPEED')
        if wind_speed > 10:
            self.risk_score *= 1 - (wind_speed - 10)/5

        if wind_gust > 15:
            #self.risk_score *= 0.8
            self.tags.append('HIGH WIND GUST')
        if wind_gust > 10:
            self.risk_score *= 1 - (wind_gust - 10)/5

        if temp < -10:
            #self.risk_score *= 0.6
            self.tags.append('EXTREME COLD TEMP')
        elif temp > 38:
            #self.risk_score *= 0.6
            self.tags.append('EXTREME HIGH TEMP')
        if temp < 0:
            self.risk_score *= 1 - temp / -10
        elif temp > 30:
            self.risk_score *= 1 - (temp - 30) / 10

        if humidity > 90:
            #self.risk_score *= 0.9
            self.tags.append('HIGH HUMIDITY')
        if humidity > 80:
            self.risk_score *= 1 - (humidity - 80) / 20

        if visibility < 2000:
            #self.risk_score *= 0.9
            self.tags.append('LOW VISIBILITY')
            if visibility < 1000:
                #self.risk_score *= 0.8
                self.tags.append('EXTREME LOW VISIBILITY')
        if visibility <= 2500:
            self.risk_score *= (visibility - 1500) / 1000

        if clouds > 80:
            #self.risk_score *= 0.9
            self.tags.append('CLOUDY')
        if clouds > 80:
            self.risk_score *= 1 - (clouds - 80) / 20

        if ndvi < 0.2:
            self.tags.append("LOW VEGETATION")
        elif ndvi < 0.5:
            self.tags.append("MODERATE VEGETATION")
            #self.risk_score *= 0.7
        else:
            self.tags.append("DENSE VEGETATION")
            #self.risk_score *= 0.5
        if self.ndvi > 0.4:
            self.risk_score *= 1 - (ndvi - 0.4) / 0.6

        if self.risk_score < 0:
            self.risk_score = 0

        data = {
            'temp' : temp,
            'humidity' : humidity,
            'wind_speed' : wind_speed,
            'wind_gust' : wind_gust,
            'clouds' : clouds,
            'visibility' : visibility,
            'ndvi' : ndvi
        }

        self.risk_score, recomandation = calculate_risk(data)
        print(self.risk_score)

    def get_coords(self):
        return [self.lat, self.lon]

def min_average_path(grid : [[Node]]):
    pos = [0,0]
    end_pos = [len(grid)-1, len(grid[0])-1]
    print("Grid Size: " + str(len(grid)) + "x" + str(len(grid[0])))
    path = [grid[0][0]]

    while pos != end_pos:
        lowest_risk_score_pos = []

        bounded_up = pos[0] == 0
        bounded_side = pos[1] == end_pos[1]
        bounded_down = pos[0] == end_pos[0]

        if bounded_side:
            lowest_risk_score_pos = [pos[0] + 1, pos[1]]
        else:
            if bounded_down:
                lowest_risk_score_pos = [pos[0], pos[1] + 1]
            else:
                if grid[pos[0] + 1][pos[1] + 1].risk_score < grid[pos[0]][pos[1] + 1].risk_score:
                    lowest_risk_score_pos = [pos[0], pos[1] + 1]
                else:
                    if grid[pos[0] + 1][pos[1] + 1].risk_score < grid[pos[0] + 1][pos[1]].risk_score:
                        lowest_risk_score_pos = [pos[0] + 1, pos[1]]
                    else:
                        lowest_risk_score_pos = [pos[0] + 1, pos[1] + 1]

        path.append(grid[lowest_risk_score_pos[0]][lowest_risk_score_pos[1]])
        pos = lowest_risk_score_pos

    return path

def get_averages_from_path(path : [Node]):
    n = len(path)
    total_risk_score = 0
    total_wind_speed = 0
    total_wind_gust = 0
    total_clouds = 0
    total_visibility = 0
    total_temp = 0
    total_humid = 0
    total_ndvi = 0

    for elem in path:
        total_risk_score += elem.risk_score
        total_temp += elem.temp
        total_clouds += elem.clouds
        total_visibility += elem.visibility
        total_humid += elem.humid
        total_wind_speed += elem.wind_speed
        total_wind_gust += elem.wind_gust
        total_ndvi += elem.ndvi

    averages = {
        'temp' : round(total_temp/n, 2),
        'humid' : round(total_humid/n, 2),
        'wind_speed' : round(total_wind_speed/n, 2),
        'wind_gust' : round(total_wind_gust/n, 2),
        'clouds' : round(total_clouds/n, 2),
        'visibility' : round(total_visibility/n, 2),
        'risk_score' : round(total_risk_score/n, 2),
        'ndvi' : round(total_ndvi/n, 2)
    }

    return averages

def get_tags_from_path(path):
    n = len(path)
    p = 0.7 * n

    tags_dict = {}

    for elem in path:
        for tag in elem.tags:
            if tag not in tags_dict:
                tags_dict[tag] = 1
            else:
                tags_dict[tag] += 1

    tags = []
    for key in tags_dict.keys():
        if tags_dict[key] >= p:
            tags.append(key)

    return tags

def shortest_route(start_lat, start_lon, end_lat, end_lon):
    temps, humiditys, wind_speeds, wind_gusts, clouds, visibilitys, lats, lons = get_grid(start_lat, start_lon, end_lat, end_lon)
    print("Got weather info!")
    ndvis = get_ndvi_grid(start_lat, start_lon, end_lat, end_lon)
    print("Got satellite info!")

    row_nr = len(temps)
    col_nr = len(temps[0])
    grid = [[] for _ in range(row_nr)]

    for i in range(row_nr):
        for j in range(col_nr):
            grid[i].append(Node(lats[i][j], lons[i][j], temps[i][j], humiditys[i][j], wind_speeds[i][j], wind_gusts[i][j], clouds[i][j], visibilitys[i][j], ndvis[i][j]))

    path = min_average_path(grid)

    route = []
    for elem in path:
        route.append(elem.get_coords())

    return route, get_averages_from_path(path), get_tags_from_path(path)

@lru_cache(maxsize=None)
def get_node_from_coords(lat, lon):
    weather = get_weather(lat, lon)
    ndvi = get_ndvi(lon, lat)
    return Node(lat, lon, weather['temp'], weather['humidity'], weather['wind_speed'], weather['wind_gusts'], weather['clouds'], weather['visibility'], ndvi)


def get_next_safest(lat, lon, bearing, end_lat, end_lon, precision=180, points = 3):
    new_nodes = []

    for i in range(points):
        new_lat, new_lon = move_point_2(lat, lon, ROUTE_RESOLUTION * 1000, (bearing - (precision/2) + (precision/(points-1)) * i) % 360)
        new_nodes.append(get_node_from_coords(new_lat, new_lon))

    safest = None

    for node in new_nodes:
        if safest is None or node.risk_score > safest.risk_score:
            safest = node
        elif node.risk_score == safest.risk_score and geodesic((node.lat, node.lon), (end_lat, end_lon)).kilometers < geodesic((safest.lat, safest.lon), (end_lat, end_lon)).kilometers:
            safest = node

    return safest


def shortest_route_opt(start_lat, start_lon, end_lat, end_lon):
    starting_point = get_node_from_coords(start_lat, start_lon)
    ending_point = get_node_from_coords(end_lat, end_lon)
    bearing = bearing_between(start_lat, start_lon, end_lat, end_lon)
    path = [starting_point]

    approx_steps = geodesic((path[-1].lat, path[-1].lon), (end_lat, end_lon)).kilometers / ROUTE_RESOLUTION
    current_step = 0

    while geodesic((path[-1].lat, path[-1].lon), (end_lat, end_lon)).kilometers > ROUTE_RESOLUTION * 1.5:
        next_node = get_next_safest(path[-1].lat, path[-1].lon, bearing, end_lat, end_lon, 120)
        bearing = bearing_between(next_node.lat, next_node.lon, end_lat, end_lon)
        path.append(next_node)
        print("Progress: " + str(round(current_step/ approx_steps * 100, 1)) + "%")
        current_step += 1

    path.append(ending_point)

    route = []
    for elem in path:
        route.append(elem.get_coords())

    return route, get_averages_from_path(path), get_tags_from_path(path)