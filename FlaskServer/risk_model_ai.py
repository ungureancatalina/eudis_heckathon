import numpy as np
import joblib
from sklearn.tree import DecisionTreeClassifier

# Example: synthetic dataset generator using Node parameters
def generate_synthetic_data(num_samples=200):
    X = []
    y = []

    for _ in range(num_samples):
        temp = np.random.uniform(-15, 45)          # Celsius
        humidity = np.random.uniform(20, 100)      # %
        wind_speed = np.random.uniform(0, 50)      # km/h
        wind_gust = np.random.uniform(0, 60)       # km/h
        clouds = np.random.uniform(0, 100)         # %
        visibility = np.random.uniform(500, 20000) # meters
        ndvi = np.random.uniform(0, 1)             # vegetation index

        # Heuristic label for Go/No-Go
        risk_score = 1.0

        # Reproduce your Node rules approximately for label
        if wind_speed > 15:
            risk_score -= 0.2
        if wind_gust > 20:
            risk_score -= 0.2
        if temp < -5 or temp > 38:
            risk_score -= 0.2
        if humidity > 85:
            risk_score -= 0.1
        if visibility < 1500:
            risk_score -= 0.2
        if clouds > 80:
            risk_score -= 0.1
        # if ndvi > 0.5:
        #     risk_score -= 0.1
        risk_score *= ndvi

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
