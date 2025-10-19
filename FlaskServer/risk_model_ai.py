from random import randint

import numpy as np
import joblib
from sklearn.tree import DecisionTreeClassifier

def get_rand_ndvi():
    p = randint(0, 100) / 100

    if p < 0.6:
        return np.random.uniform(0, 0.1)

    if p < 0.9:
        return np.random.uniform(0.1, 0.6)

    return np.random.uniform(0.6, 1)


# Example: synthetic dataset generator using Node parameters
def generate_synthetic_data(num_samples=50000):
    X = []
    y = []

    for _ in range(num_samples):
        temp = np.random.uniform(-10, 40)          # Celsius
        humidity = np.random.uniform(30, 100)      # %
        wind_speed = np.random.uniform(0, 15)      # m/h
        wind_gust = np.random.uniform(0, 15)       # m/h
        clouds = np.random.uniform(0, 100)         # %
        visibility = np.random.uniform(500, 10000) # meters
        #ndvi = np.random.uniform(0, 0.2)             # vegetation index
        ndvi = get_rand_ndvi()

        # Heuristic label for Go/No-Go
        risk_score = 1.0

        #Reproduce your Node rules approximately for label
        # if wind_speed > 15:
        #     risk_score -= 0.2
        # if wind_gust > 20:
        #     risk_score -= 0.2
        # if temp < -5 or temp > 38:
        #     risk_score -= 0.2
        # if humidity > 85:
        #     risk_score -= 0.1
        # if visibility < 1500:
        #     risk_score -= 0.2
        # if clouds > 80:
        #     risk_score -= 0.1
        # if ndvi > 0.5:
        #      risk_score -= 0.1



        if wind_speed > 10:
            risk_score *= 1 - (wind_speed - 10)/5

        if wind_gust > 10:
            risk_score *= 1 - (wind_gust - 10)/5

        if temp < 0:
            risk_score *= 1 - temp / -10
        elif temp > 30:
            risk_score *= 1 - (temp - 30) / 10

        if humidity > 80:
            risk_score *= 1 - (humidity - 80) / 20

        if visibility <= 2500:
            risk_score *= (visibility - 500) / 2000

        if clouds > 80:
            risk_score *= 1 - (clouds - 80) / 20

        if ndvi > 0.2:
            risk_score *= 1 - (ndvi - 0.2) / 0.8
        else:
            risk_score *= ndvi/0.2

        label = 1 if risk_score >= 0.5 else 0

        X.append([temp, humidity, wind_speed, wind_gust, clouds, visibility, ndvi])
        y.append(label)

    return np.array(X), np.array(y)

# Generate data
X, y = generate_synthetic_data()

# Train model
model = DecisionTreeClassifier(max_depth=5, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "risk_model_ai.pkl")
print("AI risk model trained and saved as risk_model_ai.pkl")
