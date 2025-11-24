## 🛩️ AeroMind — Intelligent Drone Mission Planner

AeroMind is a lightweight, integrated mission-planning platform designed to make drone operations safer, faster, and more efficient. Built during the EUDIS Hackathon, it brings together real-time data, AI-based risk prediction, and optimized routing into a single, intuitive interface. In disaster scenarios or military operations, conditions change rapidly, like weather, terrain, visibility, signal reliability, and regulations can turn a mission into failure. Up to 60% of missions face delays due to lack of real-time data, while only 30% of operators use dynamic planning tools. Real-time decisions could cut delays by half. AeroMind fills exactly this gap.

---

## What AeroMind Does:

- Add drones via coordinate entry or search
- Automatically check weather, wind, terrain, visibility
- Generate optimized routes
- Provide AI-based risk scoring (Go / No-Go)
- Display drone paths & hazards on an interactive map
- View military bases & available supply stock
- Update routes dynamically with a single click

---

## Technologies Used

| Tool                       | Purpose                                             |
|----------------------------|-----------------------------------------------------|
| Python (AI Module)         | Risk prediction and environmental hazard analysis   |
| React                      | Frontend development                                | 
| Tailwind CSS               | Fast styling with responsive design                 | 
| Typescript                 | Strong typing for safer code                        |
| Vite	                     | Fast frontend bundler                               |
| Leaflet.js	               | Interactive map rendering                           |
| Sentinel Hub API           | Satellite imagery, NDVI/DEM/terrain data            |
| Weather API                | Real-time weather, wind, visibility                 |

---

## Features

- Real-time data integration
- AI risk prediction
- Geospatial route visualization
- Multi-drone management
- Hazard & environment awareness
- Mission status: Go / No-Go

---

## Project Structure
```
defence-dashboard/
├── src/
│   ├── components/        # UI components: Coordinate, DroneList etc.
│   ├── services/          # Api Routes
│   ├── pages/             # Dashboard UI
├── public/                # Images & assets
├── App.(tsx)              # Main application file
└── main.(tsx)             # Entry point

FlaskServer/
├── ai/                      # Rick AI Model Prediction
├── db/                      # Database
├── utils/                   # SentinelHub, Weaather Api etc.
├── app.(py)                 # Main application file
└── route_calculations.(py)  # Route Optimisation and Calculation
```

---

## This is how the project looks like:

https://github.com/user-attachments/assets/6a26c259-fc4f-493b-8dbd-8a190a403077


