# PETROPULSE – Baghewala Reservoir Digital Twin

## 📌 Project Overview

PETROPULSE is a web-based digital twin dashboard designed to monitor
and visualize the operating condition of an oil reservoir and its
production well.

The dashboard provides a simple visual representation of important
well parameters such as temperature, viscosity, pressure and SRP status.

## 🎯 Objectives

- Monitor important well parameters
- Visualize real-time well conditions
- Provide an interactive reservoir dashboard
- Display well profile and production-related information
- Create a foundation for a future digital twin system

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js

## 📊 Main Features

### 1. Current Well State
Displays the current operating condition of the well.

### 2. Temperature
Shows the current temperature of the well.

### 3. Viscosity
Displays the current fluid viscosity.

### 4. Pressure
Shows the current well pressure.

### 5. SRP Status
Displays the operating status of the Sucker Rod Pump.

### 6. Live Well Profile
Provides a graphical representation of well-related data.

### 7. Interactive Dashboard
Users can change selected parameters and observe their effect
on the dashboard.

## 📁 Project Structure

PETROPULSE/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── backend/
│   ├── main.py
│   └── reservoir.db
│
└── assets/
    └── images/

## 🚀 How to Run

1. Open a terminal in the project folder and start the backend:

   ```powershell
   cd backend
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   Keep this terminal open while using the dashboard. The API is available at
   `http://127.0.0.1:8000`, and its interactive docs are at
   `http://127.0.0.1:8000/docs`.
2. Open the project folder in VS Code and launch `index.html` with Live Server.
   The dashboard requests its data from the running backend.

## 🔮 Future Improvements

- Real-time sensor/API integration
- Database connectivity
- Historical production data
- Advanced reservoir simulation
- AI-based production prediction
- Well performance analysis
- User authentication
- Cloud deployment

## 👨‍💻 Project Purpose

This project demonstrates how web technologies can be used to create an interactive digital twin interface for monitoring an oil reservoir and production well.

## 📌 Project Status

Current Version: Prototype / Frontend Digital Twin

Future versions can integrate real-world reservoir and sensor data.
## 🖥️ Dashboard Preview

![PETROPULSE Dashboard](assets/dashboard-preview.png)

## 🏗️ System Architecture

The current system follows a frontend-based architecture:

User
↓
PETROPULSE Dashboard
↓
JavaScript
↓
Parameter Updates
↓
Charts & Well Status
↓
Visual Output

Future versions can connect the dashboard with sensors,
backend APIs and databases for real-time data.

## 📈 Project Development

### Current Version
Frontend Digital Twin Prototype

### Planned Development
- Real-time sensor integration
- Backend API
- Database
- Historical data analysis
- AI/ML-based prediction
- Cloud deployment