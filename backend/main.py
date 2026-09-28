from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import random
from datetime import datetime
from sklearn.linear_model import LinearRegression
import math
app = FastAPI(
    title="PetroPulse Digital Twin API",
    description="Backend API for Baghewala Reservoir Digital Twin",
    version="1.0"
)


# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =====================================
# DATABASE
# =====================================

DATABASE = "reservoir.db"


def create_database():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS well_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            well TEXT,
            temperature REAL,
            pressure REAL,
            viscosity REAL,
            srp_status TEXT,
            timestamp TEXT
        )
    """)

    connection.commit()

    connection.close()


create_database()


# =====================================
# INITIAL WELL STATE
# =====================================

well_data = {
    "well": "BW-01",
    "temperature": 78.0,
    "pressure": 185.0,
    "viscosity": 12.5,
    "srp_status": "RUNNING"
}


# =====================================
# HOME
# =====================================

@app.get("/")
def home():

    return {
        "message": "PetroPulse Backend is running!"
    }


# =====================================
# LIVE WELL DATA
# =====================================

@app.get("/well-data")
def get_well_data():

    # Random simulation
    well_data["temperature"] += random.uniform(-0.8, 0.8)

    well_data["pressure"] += random.uniform(-2.5, 2.5)

    well_data["viscosity"] += random.uniform(-0.15, 0.15)


    # Limits
    well_data["temperature"] = max(
        60,
        min(100, well_data["temperature"])
    )

    well_data["pressure"] = max(
        140,
        min(230, well_data["pressure"])
    )

    well_data["viscosity"] = max(
        8,
        min(18, well_data["viscosity"])
    )


    # Round values
    well_data["temperature"] = round(
        well_data["temperature"], 1
    )

    well_data["pressure"] = round(
        well_data["pressure"], 1
    )

    well_data["viscosity"] = round(
        well_data["viscosity"], 1
    )


    # Current timestamp
    current_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    # =================================
    # SAVE DATA TO DATABASE
    # =================================

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO well_data
        (well, temperature, pressure, viscosity, srp_status, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        well_data["well"],
        well_data["temperature"],
        well_data["pressure"],
        well_data["viscosity"],
        well_data["srp_status"],
        current_time
    ))

    connection.commit()

    connection.close()


    return {
        **well_data,
        "timestamp": current_time
    }


# =====================================
# HISTORICAL DATA
# =====================================

@app.get("/history")
def get_history():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            well,
            temperature,
            pressure,
            viscosity,
            srp_status,
            timestamp
        FROM well_data
        ORDER BY id DESC
        LIMIT 50
    """)

    rows = cursor.fetchall()

    connection.close()


    history = []

    for row in rows:

        history.append({
            "well": row[0],
            "temperature": row[1],
            "pressure": row[2],
            "viscosity": row[3],
            "srp_status": row[4],
            "timestamp": row[5]
        })


    return history
# =====================================
# ANALYTICS
# =====================================

@app.get("/analytics")
def get_analytics():

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            AVG(temperature),
            MIN(temperature),
            MAX(temperature),
            AVG(pressure),
            MIN(pressure),
            MAX(pressure),
            AVG(viscosity),
            MIN(viscosity),
            MAX(viscosity),
            COUNT(*)
        FROM well_data
    """)

    row = cursor.fetchone()

    connection.close()

    return {
        "temperature": {
            "average": round(row[0], 2) if row[0] else 0,
            "minimum": round(row[1], 2) if row[1] else 0,
            "maximum": round(row[2], 2) if row[2] else 0
        },

        "pressure": {
            "average": round(row[3], 2) if row[3] else 0,
            "minimum": round(row[4], 2) if row[4] else 0,
            "maximum": round(row[5], 2) if row[5] else 0
        },

        "viscosity": {
            "average": round(row[6], 2) if row[6] else 0,
            "minimum": round(row[7], 2) if row[7] else 0,
            "maximum": round(row[8], 2) if row[8] else 0
        },

        "total_records": row[9]
    }
# =====================================
# ANOMALY DETECTION
# =====================================

@app.get("/anomaly")
def detect_anomaly():

    temperature = well_data["temperature"]
    pressure = well_data["pressure"]
    viscosity = well_data["viscosity"]

    warnings = []

    # Temperature check
    if temperature >= 95:
        warnings.append("High temperature")
    elif temperature <= 65:
        warnings.append("Low temperature")

    # Pressure check
    if pressure >= 220:
        warnings.append("High pressure")
    elif pressure <= 150:
        warnings.append("Low pressure")

    # Viscosity check
    if viscosity >= 17:
        warnings.append("High viscosity")
    elif viscosity <= 9:
        warnings.append("Low viscosity")


    # Determine overall status
    if len(warnings) == 0:

        status = "NORMAL"

    elif len(warnings) == 1:

        status = "WARNING"

    else:

        status = "CRITICAL"


    return {
        "status": status,
        "temperature": temperature,
        "pressure": pressure,
        "viscosity": viscosity,
        "warnings": warnings
    }
# =====================================
# ML PREDICTION
# =====================================

@app.get("/ml-prediction")
def ml_prediction():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        SELECT temperature, pressure, viscosity
        FROM well_data
        ORDER BY id DESC
        LIMIT 30
    """)

    rows = cursor.fetchall()

    connection.close()


    # Need enough historical data
    if len(rows) < 5:

        return {
            "status": "INSUFFICIENT_DATA",
            "message": "At least 5 historical records are required."
        }


    # Reverse data so it is oldest → newest
    rows.reverse()


    # Create time/index values
    X = [[i] for i in range(len(rows))]


    # Separate parameters

    temperature_y = [
        row[0] for row in rows
    ]

    pressure_y = [
        row[1] for row in rows
    ]

    viscosity_y = [
        row[2] for row in rows
    ]


    # Create ML models

    temperature_model = LinearRegression()

    pressure_model = LinearRegression()

    viscosity_model = LinearRegression()


    # Train models

    temperature_model.fit(
        X,
        temperature_y
    )

    pressure_model.fit(
        X,
        pressure_y
    )

    viscosity_model.fit(
        X,
        viscosity_y
    )


    # Predict next point

    next_point = [[len(rows)]]


    predicted_temperature = temperature_model.predict(
        next_point
    )[0]

    predicted_pressure = pressure_model.predict(
        next_point
    )[0]

    predicted_viscosity = viscosity_model.predict(
        next_point
    )[0]


    return {

        "status": "SUCCESS",

        "data_points_used": len(rows),

        "predicted_temperature":
            round(float(predicted_temperature), 2),

        "predicted_pressure":
            round(float(predicted_pressure), 2),

        "predicted_viscosity":
            round(float(predicted_viscosity), 2)
    }
# =====================================
# PRODUCTION FORECAST
# =====================================

@app.get("/production")
def get_production():

    # Simulated current production
    current_production = round(
        420 + random.uniform(-15, 15), 2
    )

    # Simple forecast
    predicted_production = round(
        current_production + random.uniform(-10, 10), 2
    )

    return {
        "current_production": current_production,
        "predicted_production": predicted_production,
        "unit": "bbl/day"
    }