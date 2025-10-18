from flask import Flask, request, jsonify

import weather_api
from weather_api import get_weather
from risk_model import calculate_risk
from sentinelhub_utils import fetch_sentinel2_image, img_to_base64
from route_calculations import shortest_route
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/calculate_route", methods=['POST'])
def get_route():

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON received"}), 400

    start_lat = data.get('start_lat')
    start_lon = data.get('start_lon')
    end_lat = data.get('end_lat')
    end_lon = data.get('end_lon')

    route = shortest_route(start_lat, start_lon, end_lat, end_lon)

    print(str(start_lat) + " =? " + str(route[0][0]))
    print(str(start_lon) + " =? " + str(route[0][1]))

    print(str(end_lat) + " =? " + str(route[-1][0]))
    print(str(end_lon) + " =? " + str(route[-1][1]))

    print("Route sent!")
    return jsonify({'route': route})


@app.route("/risk_score", methods=["GET"])
def risk_score():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    if lat is None or lon is None:
        return jsonify({"error": "Provide lat and lon"}), 400

    # Get weather data
    weather_data = get_weather(lat, lon)

    # Calculate risk
    score, recommendation = calculate_risk(weather_data)

    # Fetch satellite image
    img_array = fetch_sentinel2_image(lat, lon)
    if img_array is not None:
        img_base64 = img_to_base64(img_array)
    else:
        img_base64 = None

    return jsonify({
        "risk_score": score,
        "recommendation": recommendation,
        "weather": weather_data,
        "satellite_image": img_base64
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
