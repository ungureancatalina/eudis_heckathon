from weather_api import get_grid
from collections import deque
import math

class Node:
    def __init__(self, lat, lon,temp, humidity, wind_speed, wind_gust, clouds, visibility, risk_score = 1):
        self.lat = lat
        self.lon = lon

        self.temp = temp
        self.humid = humidity
        self.wind_speed = wind_speed
        self.wind_gust = wind_gust
        self.clouds = clouds
        self.visibility = visibility

        self.risk_score = risk_score

        self.tags = []

        if wind_speed > 10:
            self.risk_score *= 0.8
            self.tags.append('HIGH WIND SPEED')
            if wind_speed > 15:
                self.risk_score -= 0.8
                self.tags.append('EXTREME WIND SPEED')

        if wind_gust > 15:
            self.risk_score *= 0.8
            self.tags.append('HIGH WIND GUST')

        if temp < -10:
            self.risk_score *= 0.6
            self.tags.append('EXTREME COLD TEMP')
        elif temp > 38:
            self.risk_score *= 0.6
            self.tags.append('EXTREME HIGH TEMP')

        if humidity > 90:
            self.risk_score *= 0.9
            self.tags.append('HIGH HUMIDITY')

        if visibility < 2000:
            self.risk_score *= 0.9
            self.tags.append('LOW VISIBILITY')
            if visibility < 1000:
                self.risk_score *= 0.8
                self.tags.append('EXTREME LOW VISIBILITY')

        if clouds > 80:
            self.risk_score *= 0.9
            self.tags.append('CLOUDY')

    def get_coords(self):
        return [self.lat, self.lon]

def min_average_path(grid : [[Node]]):
    pos = [0,0]
    end_pos = [len(grid)-1, len(grid[0])-1]
    print(end_pos)
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
                if grid[pos[0] + 1][pos[1] + 1].risk_score > grid[pos[0]][pos[1] + 1].risk_score:
                    lowest_risk_score_pos = [pos[0], pos[1] + 1]
                else:
                    if grid[pos[0] + 1][pos[1] + 1].risk_score > grid[pos[0] + 1][pos[1]].risk_score:
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

    for elem in path:
        total_risk_score += elem.risk_score
        total_temp += elem.temp
        total_clouds += elem.clouds
        total_visibility += elem.visibility
        total_humid += elem.humid
        total_wind_speed += elem.wind_speed
        total_wind_gust += elem.wind_gust

    averages = {
        'temp' : total_temp/n,
        'humid' : total_humid/n,
        'wind_speed' : total_wind_speed/n,
        'wind_gust' : total_wind_gust/n,
        'clouds' : total_clouds/n,
        'visibility' : total_visibility/n,
        'risk_score' : total_risk_score/n
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

    row_nr = len(temps)
    col_nr = len(temps[0])
    grid = [[] for _ in range(row_nr)]

    for i in range(row_nr):
        for j in range(col_nr):
            grid[i].append(Node(lats[i][j], lons[i][j], temps[i][j], humiditys[i][j], wind_speeds[i][j], wind_gusts[i][j], clouds[i][j], visibilitys[i][j]))

    path = min_average_path(grid)

    route = []
    for elem in path:
        route.append(elem.get_coords())

    return route, get_averages_from_path(path), get_tags_from_path(path)