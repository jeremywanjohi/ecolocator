# Ecolocator

Ecolocator is a mobile application designed to help users locate recycling centers and earn rewards for their recycling activities. The app promotes sustainable practices by incentivizing recycling and making it easy for users to find the nearest recycling centers.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Project Setup/Installation Instructions

### Clone The Repository
This will create a folder named ecolocator-project in your current directory and clone the repository into it.
```
git clone https://github.com/jeremywanjohi/ecolocator.git ecolocator
```

### Prerequisites
1. Install Node.js: [Node.js](https://nodejs.org/)
2. Install Expo : Open your terminal and run:
    ```bash
   npx create-expo-app@latest
    ```
3. Install MySQL :[MySQL](https://www.mysql.com/downloads/)

#### Backend Setup:

1. **Navigate to the backend directory:**
   ```bash
   cd ecolocator-backend 
2. **Set up the MySQL database:**
   Create a database named ecolocator.
   Use the provided [SQL](EcolocatorSQL) script to create tables.

3. **Start the backend server:**
   ```bash
   node src/index.js

#### Frontend Setup:

1. **Navigate to the frontend directory:**
   ```bash
   cd ecolocator-frontend/ecolocator-app
   
2. **Install Dependencies:**
   ```bash
   npm install

3. **Start the Expo project:**
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

```
.expo/
ecolocator-backend/
├── config/
│   ├── ...
├── node_modules/
│   ├── ...
├── src/
│   ├── ...
├── package-lock.json
├── package.json
ecolocator-frontend/ecolocator-app/
├── .expo/
│   ├── ...
├── assets/
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
└── README.md
```




#### Key Files:
#### Backend
`ecolocator-backend/src/index.js`:
-The main entry point for the backend server.
-Sets up Express, connects to the database, and starts the server.






