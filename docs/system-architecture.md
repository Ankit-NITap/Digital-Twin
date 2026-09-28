# System Architecture

## 1. Overview

PETROPULSE follows a frontend-based architecture in which the user
interacts with the dashboard through a web browser.

The system consists of three main layers:

1. User Interface
2. Application Logic
3. Data Visualization

## 2. Architecture Flow

User
  ↓
Dashboard Interface
  ↓
JavaScript Logic
  ↓
Parameter Updates
  ↓
Charts and Well Status
  ↓
Visual Output

## 3. Frontend Layer

The frontend is responsible for displaying the dashboard.

HTML is used to create:

- Dashboard structure
- Navigation sidebar
- Parameter cards
- Well status section
- Graph containers

## 4. Styling Layer

CSS is used to control:

- Dark theme
- Layout
- Colors
- Cards
- Buttons
- Sidebar
- Responsive appearance

## 5. Application Logic

JavaScript controls the interactive behaviour of the dashboard.

It is responsible for:

- Changing parameter values
- Updating dashboard elements
- Updating graphs
- Handling user interactions
- Managing dashboard states

## 6. Data Visualization

Charts are used to represent well-related information visually.

Chart.js is used for creating interactive graphs and displaying
changes in the well profile.

## 7. Future Architecture

In future versions, the frontend can be connected to a backend system.

Future architecture:

Sensors
  ↓
Data Acquisition
  ↓
Backend / API
  ↓
Database
  ↓
PETROPULSE Dashboard
  ↓
Visualization & Analysis

This architecture can allow the system to receive real-time
reservoir and production data.

## 8. Future Extensions

The system can later include:

- Real-time sensor integration
- Database storage
- Production history
- API connectivity
- AI-based prediction
- Reservoir performance analysis
- Cloud deployment