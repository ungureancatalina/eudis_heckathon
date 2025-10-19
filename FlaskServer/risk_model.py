import joblib
import numpy as np

# Load AI model (trained in risk_model_ai.py)
model = joblib.load("risk_model_ai.pkl")

def calculate_risk(data):
    """
    Expects weather_data dict with:
    temp, humidity, wind_speed, wind_gust, clouds, visibility, ndvi
    """

    features = np.array([
        data['temp'],
        data['humidity'],
        data['wind_speed'],
        data['wind_gust'],
        data['clouds'],
        data['visibility'],
        data['ndvi']
    ]).reshape(1, -1)

    pred = model.predict(features)[0]               # 1 = Go, 0 = No Go
    prob = model.predict_proba(features)[0][1]     # probability of Go

    recommendation = "GO" if pred == 1 else "NO GO"
    return float(prob), recommendation
