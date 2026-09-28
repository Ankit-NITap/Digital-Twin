/* =====================================
   PETROPULSE DIGITAL TWIN
   JavaScript
===================================== */


/* =====================================
   PYTHON BACKEND API
===================================== */

const API_URL = "http://127.0.0.1:8000/well-data";


/* =====================================
   CLOCK
===================================== */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString();

    document.getElementById("currentTime").textContent = time;
}

setInterval(updateClock, 1000);

updateClock();


/* =====================================
   SENSOR SLIDERS
===================================== */

const temperatureSlider =
    document.getElementById("temperatureSlider");

const viscositySlider =
    document.getElementById("viscositySlider");

const pressureSlider =
    document.getElementById("pressureSlider");


const temperatureValue =
    document.getElementById("temperatureValue");

const viscosityValue =
    document.getElementById("viscosityValue");

const pressureValue =
    document.getElementById("pressureValue");


/* =====================================
   TEMPERATURE
===================================== */

temperatureSlider.addEventListener("input", function () {

    temperatureValue.textContent =
        this.value;

    updateChart();

});


/* =====================================
   VISCOSITY
===================================== */

viscositySlider.addEventListener("input", function () {

    viscosityValue.textContent =
        Number(this.value).toFixed(1);

});


/* =====================================
   PRESSURE
===================================== */

pressureSlider.addEventListener("input", function () {

    pressureValue.textContent =
        this.value;

    updateChart();

});


/* =====================================
   SRP BUTTON
===================================== */

const srpButton =
    document.getElementById("srpButton");

const srpStatus =
    document.querySelector(".srp-status strong");

const srpIcon =
    document.querySelector(".srp-icon");


let srpRunning = true;


srpButton.addEventListener("click", function () {

    if (srpRunning) {

        srpRunning = false;

        srpButton.textContent =
            "START SRP";

        srpStatus.textContent =
            "STOPPED";

        srpStatus.style.color =
            "#e7b45b";

        srpIcon.textContent =
            "×";

        srpIcon.style.color =
            "#e7b45b";

    } else {

        srpRunning = true;

        srpButton.textContent =
            "STOP SRP";

        srpStatus.textContent =
            "RUNNING";

        srpStatus.style.color =
            "#5ee0ae";

        srpIcon.textContent =
            "✓";

        srpIcon.style.color =
            "#54dfa9";
    }

});


/* =====================================
   WELL SELECTOR
===================================== */

const wellSelect =
    document.getElementById("wellSelect");

const wellId =
    document.getElementById("wellId");


wellSelect.addEventListener("change", function () {

    wellId.textContent =
        this.value;

});


/* =====================================
   LIVE WELL PROFILE CHART
===================================== */

const ctx =
    document.getElementById("wellChart").getContext("2d");


const labels = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00"
];


let pressureData = [
    170, 175, 172, 180,
    178, 184, 181, 188,
    185, 190, 187, 185
];


let temperatureData = [
    72, 73, 74, 75,
    75, 76, 77, 77,
    78, 79, 78, 78
];


const wellChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [

            {
                label: "Pressure",

                data: pressureData,

                borderColor: "#53d5f3",

                backgroundColor:
                    "rgba(83, 213, 243, 0.08)",

                borderWidth: 2,

                tension: 0.4,

                fill: true,

                pointRadius: 2,

                pointBackgroundColor:
                    "#53d5f3"
            },

            {
                label: "Temperature",

                data: temperatureData,

                borderColor: "#4bdaa2",

                backgroundColor:
                    "rgba(75, 218, 162, 0.05)",

                borderWidth: 2,

                tension: 0.4,

                fill: false,

                pointRadius: 2,

                pointBackgroundColor:
                    "#4bdaa2",

                yAxisID: "temperatureAxis"
            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {

            legend: {
                display: false
            }

        },

        scales: {

            x: {

                grid: {
                    color: "#193039"
                },

                ticks: {

                    color: "#607980",

                    font: {
                        size: 10
                    }

                }

            },

            y: {

                beginAtZero: false,

                grid: {
                    color: "#193039"
                },

                ticks: {

                    color: "#607980",

                    font: {
                        size: 10
                    }

                }

            },

            temperatureAxis: {

                position: "right",

                grid: {
                    drawOnChartArea: false
                },

                ticks: {

                    color: "#4bdaa2",

                    font: {
                        size: 10
                    }

                }

            }

        }

    }

});


/* =====================================
   UPDATE CHART
===================================== */

function updateChart() {

    const pressure =
        Number(pressureSlider.value);

    const temperature =
        Number(temperatureSlider.value);


    pressureData[pressureData.length - 1] =
        pressure;

    temperatureData[
        temperatureData.length - 1
    ] = temperature;


    wellChart.data.datasets[0].data =
        pressureData;

    wellChart.data.datasets[1].data =
        temperatureData;


    wellChart.update();

}


/* =====================================
   LOAD DATA FROM PYTHON BACKEND
===================================== */

async function loadWellData() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Backend response error"
            );

        }


        const data =
            await response.json();


        console.log(
            "Data received from Python:",
            data
        );


        /* ================================
           UPDATE DASHBOARD
        ================================= */

        temperatureSlider.value =
            data.temperature;

        pressureSlider.value =
            data.pressure;

        viscositySlider.value =
            data.viscosity;


        temperatureValue.textContent =
            data.temperature;

        pressureValue.textContent =
            data.pressure;

        viscosityValue.textContent =
            Number(data.viscosity).toFixed(1);


        /* ================================
           UPDATE WELL
        ================================= */

        wellId.textContent =
            data.well;


        /* ================================
           UPDATE SRP
        ================================= */

        if (data.srp_status === "RUNNING") {

            srpRunning = true;

            srpButton.textContent =
                "STOP SRP";

            srpStatus.textContent =
                "RUNNING";

            srpStatus.style.color =
                "#5ee0ae";

            srpIcon.textContent =
                "✓";

            srpIcon.style.color =
                "#54dfa9";

        }


        else {

            srpRunning = false;

            srpButton.textContent =
                "START SRP";

            srpStatus.textContent =
                "STOPPED";

            srpStatus.style.color =
                "#e7b45b";

            srpIcon.textContent =
                "×";

            srpIcon.style.color =
                "#e7b45b";

        }


        /* ================================
           UPDATE GRAPH
        ================================= */

        pressureData[
            pressureData.length - 1
        ] = data.pressure;


        temperatureData[
            temperatureData.length - 1
        ] = data.temperature;


        wellChart.update();


        /* ================================
           LAST UPDATE
        ================================= */

        const lastUpdate =
            document.getElementById("lastUpdate");

        if (lastUpdate) {

            lastUpdate.textContent =
                "Just now";

        }

    }

    catch (error) {

        console.error(
            "Backend connection failed:",
            error
        );

    }

}


/* =====================================
   REFRESH BUTTON
===================================== */

const refreshButton =
    document.getElementById("refreshButton");


refreshButton.addEventListener("click", async function () {

    refreshButton.textContent =
        "Loading...";


    await loadWellData();


    refreshButton.textContent =
        "✓ Data Refreshed";


    setTimeout(function () {

        refreshButton.textContent =
            "↻ Refresh Data";

    }, 1500);

});


/* =====================================
   AUTOMATIC BACKEND DATA UPDATE
===================================== */

setInterval(function () {

    if (srpRunning) {

        loadWellData();

    }

}, 5000);


/* =====================================
   INITIAL BACKEND DATA LOAD
===================================== */

loadWellData();


/* =====================================
   TEST
===================================== */

console.log(
    "PETROPULSE JAVASCRIPT LOADED SUCCESSFULLY"
);
/* =====================================
   HISTORICAL DATA
===================================== */

const historyBody =
    document.getElementById("historyBody");

const historyRefresh =
    document.getElementById("historyRefresh");


async function loadHistory() {

    try {

        const response =
            await fetch("http://127.0.0.1:8000/history");

        const history =
            await response.json();


        historyBody.innerHTML = "";


        if (history.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No historical data available
                    </td>
                </tr>
            `;

            return;
        }


        history.forEach(function (item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.well}</td>
                <td>${item.temperature} °C</td>
                <td>${item.pressure}</td>
                <td>${item.viscosity}</td>
                <td>${item.srp_status}</td>
            `;


            historyBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "History loading failed:",
            error
        );

        historyBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load historical data
                </td>
            </tr>
        `;

    }

}


/* =====================================
   HISTORY REFRESH BUTTON
===================================== */

historyRefresh.addEventListener(
    "click",
    loadHistory
);


/* =====================================
   INITIAL HISTORY LOAD
===================================== */

loadHistory();
/* =====================================
   ANALYTICS
===================================== */

async function loadAnalytics() {

    try {

        const response =
            await fetch("http://127.0.0.1:8000/analytics");

        if (!response.ok) {
            throw new Error("Analytics API error");
        }

        const data = await response.json();

        console.log("Analytics received:", data);


        // Temperature

        document.getElementById("tempAvg").textContent =
            data.temperature.average + " °C";

        document.getElementById("tempMin").textContent =
            data.temperature.minimum + " °C";

        document.getElementById("tempMax").textContent =
            data.temperature.maximum + " °C";


        // Pressure

        document.getElementById("pressureAvg").textContent =
            data.pressure.average;

        document.getElementById("pressureMin").textContent =
            data.pressure.minimum;

        document.getElementById("pressureMax").textContent =
            data.pressure.maximum;


        // Viscosity

        document.getElementById("viscosityAvg").textContent =
            data.viscosity.average;

        document.getElementById("viscosityMin").textContent =
            data.viscosity.minimum;

        document.getElementById("viscosityMax").textContent =
            data.viscosity.maximum;


        // Total records

        document.getElementById("totalRecords").textContent =
            data.total_records;

    }

    catch (error) {

        console.error(
            "Analytics loading failed:",
            error
        );

    }

}


/* Load analytics */

loadAnalytics();


/* Refresh analytics every 5 seconds */

setInterval(function () {

    loadAnalytics();

}, 5000);
/* =====================================
   ANOMALY DETECTION
===================================== */

async function loadAnomaly() {

    try {

        const response =
            await fetch("http://127.0.0.1:8000/anomaly");

        if (!response.ok) {
            throw new Error("Anomaly API error");
        }

        const data = await response.json();

        console.log("Anomaly data:", data);


        // Update values

        document.getElementById(
            "anomalyTemperature"
        ).textContent = data.temperature + " °C";


        document.getElementById(
            "anomalyPressure"
        ).textContent = data.pressure;


        document.getElementById(
            "anomalyViscosity"
        ).textContent = data.viscosity;


        // Update status

        const status =
            document.getElementById("healthStatus");

        const indicator =
            document.getElementById("healthIndicator");

        status.textContent = data.status;


        // Normal

        if (data.status === "NORMAL") {

            status.style.color = "#5ee0ae";

            indicator.textContent = "●";
            indicator.style.color = "#5ee0ae";

        }


        // Warning

        else if (data.status === "WARNING") {

            status.style.color = "#e7b45b";

            indicator.textContent = "●";
            indicator.style.color = "#e7b45b";

        }


        // Critical

        else {

            status.style.color = "#ff6262";

            indicator.textContent = "●";
            indicator.style.color = "#ff6262";

        }


        // Warning messages

        const warningMessage =
            document.getElementById("warningMessage");


        if (data.warnings.length === 0) {

            warningMessage.textContent =
                "No anomalies detected.";

        }

        else {

            warningMessage.textContent =
                data.warnings.join(" | ");

        }

    }

    catch (error) {

        console.error(
            "Anomaly detection failed:",
            error
        );

    }

}


/* Load anomaly data */

loadAnomaly();


/* Refresh every 5 seconds */

setInterval(function () {

    loadAnomaly();

}, 5000);
/* =====================================
   ML PREDICTION
===================================== */

async function loadPrediction() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/ml-prediction"
            );

        if (!response.ok) {
            throw new Error("ML Prediction API error");
        }

        const data = await response.json();

        console.log("ML Prediction:", data);


        // Check data availability

        if (data.status !== "SUCCESS") {

            document.getElementById(
                "predictionStatus"
            ).textContent = "WAITING FOR DATA";

            return;
        }


        // Predicted temperature

        document.getElementById(
            "predictedTemperature"
        ).textContent =
            data.predicted_temperature;


        // Predicted pressure

        document.getElementById(
            "predictedPressure"
        ).textContent =
            data.predicted_pressure;


        // Predicted viscosity

        document.getElementById(
            "predictedViscosity"
        ).textContent =
            data.predicted_viscosity;


        // Training records

        document.getElementById(
            "dataPointsUsed"
        ).textContent =
            data.data_points_used;


        // Status

        document.getElementById(
            "predictionStatus"
        ).textContent =
            "MODEL ACTIVE";

    }

    catch (error) {

        console.error(
            "ML Prediction failed:",
            error
        );

        document.getElementById(
            "predictionStatus"
        ).textContent =
            "MODEL ERROR";
    }

}


/* Initial prediction */

loadPrediction();


/* Update prediction every 10 seconds */

setInterval(function () {

    loadPrediction();

}, 10000);
/* =====================================
   PRODUCTION FORECAST
===================================== */

async function loadProduction() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/production"
            );

        if (!response.ok) {
            throw new Error("Production API error");
        }

        const data = await response.json();

        document.getElementById(
            "currentProduction"
        ).textContent = data.current_production;

        document.getElementById(
            "predictedProduction"
        ).textContent = data.predicted_production;

    }

    catch (error) {

        console.error(
            "Production loading failed:",
            error
        );

    }
}


/* Initial load */

loadProduction();


/* Refresh every 10 seconds */

setInterval(function () {

    loadProduction();

}, 10000);