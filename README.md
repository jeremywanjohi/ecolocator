# Ecolocator

Ecolocator is a mobile application designed to help users locate recycling centers and earn rewards for their recycling activities. The app promotes sustainable practices by incentivizing recycling and making it easy for users to find the nearest recycling centers.

MIT License

Copyright (c) 2024 Jeremy Wanjohi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


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
