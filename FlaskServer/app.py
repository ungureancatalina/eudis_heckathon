from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.distance import geodesic
from route_calculations import shortest_route_opt
from db.db_logic import *

app = Flask(__name__)
CORS(app)

@app.route("/calculate_route", methods=['POST'])
def calculate_route():

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON received"}), 400

    start_lat = data.get('start_lat')
    start_lon = data.get('start_lon')
    end_lat = data.get('end_lat')
    end_lon = data.get('end_lon')

    distance = geodesic((start_lat, start_lon), (end_lat, end_lon)).km
    if distance < 1.2:
        return jsonify({"error": "Distance too small"}), 400

    route, average, tags = shortest_route_opt(start_lat, start_lon, end_lat, end_lon)

    add_route(data.get('name'), {'route': route, 'averages': average, 'recommendation': "No Go" if average['risk_score']<0.5 else "Go", 'tags' : tags})

    print("Route sent!")
    return jsonify({'route': route, 'averages': average, 'recommendation': "No Go" if average['risk_score']<0.5 else "Go", 'tags' : tags}), 200

@app.route("/get_route", methods=['GET'])
def get_route_from_db():
    data = request.get_json()
    name = data.get('name')
    route = get_route(name)

    return jsonify(route), 200

@app.route("/get_all_routes_names", methods=['GET'])
def get_all_routes():
    routes_names = list_routes()
    return jsonify({'names' : routes_names}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
