# Ecolocator

Ecolocator is a mobile application designed to help users locate recycling centers and earn rewards for their recycling activities. The app promotes sustainable practices by incentivizing recycling and making it easy for users to find the nearest recycling centers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Project Setup/Installation Instructions

### Dependencies:
- Node.js
- MySQL
- Expo CLI
- React Native
- Nodemailer
- bcryptjs
- cors

### Installation Steps:

#### Backend Setup:

1. **Navigate to the backend directory:**
   ```bash
   cd ecolocator-backend
   
2. **Install Dependencies:**
   ```bash
   npm install

3. **Set up the MySQL database:**
   Create a database named ecolocator.
   Use the provided SQL script to create tables.

4. **Start the backend server:**
   ```bash
   node src/index.js

#### Frontend Setup:

1. **Navigate to the frontend directory:**
   ```bash
   cd ecolocator-frontend/ecolocator-app

2. **Install Expo CLI globally if not already installed:**
   ```bash
   npm install -g expo-cli

3. **Install Dependencies:**
   ```bash
   npm install

4. **Start the Expo project:**
   ```bash
   npx expo start

### Examples:

#### Registration:
- Register a new user via the registration form on the mobile app.
- An activation email will be sent to the registered email address.

#### Login:
- Log in using the registered email and password.

#### Recycling Activities:
- Navigate to the "Find Nearest Place" to locate nearby recycling centers.
- Check the "Stores & Rewards" section to view available stores and rewards.

### Input/Output:

#### Input:
- User details for registration (email, password, phone number, first name, last name).
- Location data for finding nearby recycling centers.

#### Output:
- User rewards and available recycling stores.
- Directions to the nearest recycling center.

### Project Structure:

#### Overview:
The project is divided into two main parts: the backend and the frontend. Each part contains relevant folders and files to support its functionality.

# Ecolocator Project Structure
.expo/
ecolocator-backend/
├── config/
│   ├── ...
├── models/
│   ├── ...
├── node_modules/
│   ├── ...
├── src/
│   ├── ...
├── .env
├── package-lock.json
├── package.json
ecolocator-frontend/ecolocator-app/
├── .expo/
│   ├── ...
├── %ProgramData%/
│   ├── ...
├── assets/
│   ├── ...
├── bin/
│   ├── ...
├── node_modules/
│   ├── ...
├── screens/
│   ├── ...
├── .env
├── .gitignore
├── App.js
├── app.json
├── babel.config.js
├── package-lock.json
├── package.json
├── react-native-map-web-fix.js
├── README.md
├── package-lock.json
└── package.json



#### Key Files:

- **ecolocator-backend/src/index.js**: The main entry point for the backend server. It sets up Express, connects to the database, and starts the server.
- **ecolocator-backend/src/routes.js**: Defines all the API endpoints and connects them to their respective controllers.
- **ecolocator-backend/src/controllers**: Contains functions that handle the logic for each endpoint.
- **ecolocator-frontend/ecolocator-app/App.js**: The main entry point for the frontend application. It sets up navigation and links all the screens together.
- **ecolocator-frontend/ecolocator-app/screens**: Contains the main screens such as `WelcomeScreen`, `LoginScreen`, `MapScreen`, `NearestCenterScreen`, and `DirectionsScreen`.
- **ecolocator-frontend/ecolocator-app/navigation**: Configures the navigation between different screens using React Navigation.
- **ecolocator-frontend/ecolocator-app/.env**: Contains environment variables like API URLs to configure the frontend application.








