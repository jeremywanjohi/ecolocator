# Ecolocator

Ecolocator is a mobile application designed to help users locate recycling centers and earn rewards for their recycling activities. The app promotes sustainable practices by incentivizing recycling and making it easy for users to find the nearest recycling centers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



### Features

- **User Registration and Login**
  - Create an account with email, password, phone number, first name, and last name.
  - Email verification for account activation.
  - Login with email and password.

- **Homepage**
  - Displays a welcome message with the user's name and reward points (RCOINS).
  - Access to Stores, Coupons & Rewards, and Activities.

- **Email Notifications**
  - Activation email upon registration.
  - Password reset emails for users who request it.

- **Password Reset**
  - Users can request a password reset link via email and set a new password.

- **Recycling Activities**
  - Find the nearest recycling centers, recycle items, read news, access stores and rewards, learn about types of waste, and get support.

### Requirements

- Node.js
- MySQL
- Expo CLI
- React Native

### Environment Setup

#### Backend Setup

1. Ensure you have MySQL installed and running.
2. Create a database named `ecolocator` and use the provided SQL script to create tables.
3. Install dependencies:
   ```bash
   npm install express mysql2 bcryptjs nodemailer cors
