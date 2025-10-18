from weather_api import get_grid
from collections import deque
import math

class Node:
    def __init__(self, lat, lon, temp):
        self.lat = lat
        self.lon = lon
        self.temp = temp
        self.risk_score = temp
        self.visited = False

    def visit(self):
        self.visited = True

    def is_visited(self):
        return self.visited

    def get_coords(self):
        return [self.lat, self.lon]


def min_average_path(grid : [[Node]]):
    pos = [0,0]
    end_pos = [len(grid)-1, len(grid[0])-1]
    print(end_pos)
    path = []

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

def shortest_route(start_lat, start_lon, end_lat, end_lon):
    temps, lats, lons = get_grid(start_lat, start_lon, end_lat, end_lon)

    print("Got weather info!")

    row_nr = len(temps)
    col_nr = len(temps[0])
    grid = [[] for _ in range(row_nr)]

    for i in range(row_nr):
        for j in range(col_nr):
            grid[i].append(Node(lats[i][j], lons[i][j], temps[i][j]))

    path = min_average_path(grid)

    route = []
    for elem in path:
        route.append(elem.get_coords())

    return route