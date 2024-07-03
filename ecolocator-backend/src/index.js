const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fishman18',
    database: 'ecolocator',
    port: 3306
});

const calculateRewardPoints = (materialType, weight) => {
    const pointsPerKg = {
        Plastic: 10,
        Paper: 5,
        Glass: 7,
        Metal: 15,
        Electronics: 20,
        Textiles: 8,
        Organic: 3
    };
    return pointsPerKg[materialType] * weight;
};

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex');
};

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jeremykwanjohi@gmail.com',
        pass: 'tcmi qnqq uevp pjud',
    },
});

const sendRedemptionEmail = (email, points, shopName, amount) => {
    const mailOptions = {
        from: 'jeremykwanjohi@gmail.com',
        to: email,
        subject: 'Points Redemption Confirmation',
        text: `Dear user,

You have successfully redeemed ${points} points at ${shopName}. The equivalent amount is ${amount} KES.

Thank you for using our service!

Best regards,
EcoLocator`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // Convert to meters
};

app.post('/register', async (req, res) => {
    const { email, password, phoneNumber, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (email, hashed_password, phone_number, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?, ?)', 
    [email, hashedPassword, phoneNumber, firstName, lastName, false], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        const activationLink = `http://192.168.100.74:8081/activate?email=${encodeURIComponent(email)}`;
        
        const mailOptions = {
            from: 'jeremy.wanjohi@strathmore.edu',
            to: email,
            subject: 'Account Activation',
            text: `Please activate your account by clicking the following link: ${activationLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email' });
            }
            res.status(200).json({ message: 'Registration successful! Please check your email to activate your account.' });
        });
    });
});

app.get('/activate', (req, res) => {
    const { email } = req.query;

    db.query('UPDATE users SET is_active = ? WHERE email = ?', [1, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Invalid activation link' });
        }
        res.json({ message: 'Account activated! You can now log in.' });
    });
});

app.get('/user', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query('SELECT email, phone_number AS phoneNumber, first_name AS firstName, last_name AS lastName, profile_picture AS profilePicture, preferred_location AS preferredLocation, alternativeEmail AS alternativeEmail, created_at As registrationDate FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(results[0]);
    });
});

app.get('/users', (req, res) => {
    const query = `
        SELECT email, phone_number AS phoneNumber, first_name AS firstName, last_name AS lastName, profile_picture AS profilePicture 
        FROM users 
        WHERE role = 'user'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.status(200).json(results);
    });
});

app.delete('/users/:email', (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Update user email
app.post('/update-email', (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
        return res.status(400).json({ error: 'Both old and new email are required' });
    }

    db.query('UPDATE users SET email = ? WHERE email = ?', [newEmail, oldEmail], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Email updated successfully' });
    });
});

// Update user phone number
app.post('/update-phone', (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
        return res.status(400).json({ error: 'Email and phone number are required' });
    }

    db.query('UPDATE users SET phone_number = ? WHERE email = ?', [phoneNumber, email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Phone number updated successfully' });
    });
});

app.post('/update-preferred-location', (req, res) => {
    const { email, preferredLocation } = req.body;

    if (!email || !preferredLocation) {
        return res.status(400).json({ error: 'Email and preferred location are required' });
    }

    db.query('UPDATE users SET preferred_location = ? WHERE email = ?', [preferredLocation, email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Preferred location updated successfully' });
    });
});

app.post('/update-alternative-email', (req, res) => {
    const { email, alternativeEmail } = req.body;

    if (!email || !alternativeEmail) {
        return res.status(400).json({ error: 'Email and alternative email are required' });
    }

    db.query('UPDATE users SET alternativeEmail = ? WHERE email = ?', [alternativeEmail, email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Alternative email updated successfully' });
    });
});

app.post('/upload-profile-picture', upload.single('image'), (req, res) => {
    const { email } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    db.query('UPDATE users SET profile_picture = ? WHERE email = ?', [imageUrl, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating profile picture' });
        }
        res.status(200).json({ message: 'Profile picture updated successfully', imageUrl });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.hashed_password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: 'Account not activated. Please check your email.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phoneNumber: user.phone_number,
            profilePicture: user.profile_picture,
            role: user.role,
            userId: user.user_id
        });
    });
});

app.post('/shoplogin', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM shops WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            console.log('Shop not found or invalid password:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const shop = results[0];
        res.json({
            message: 'Login successful',
            role: 'shop',
            shopId: shop.shop_id,
            shopName: shop.name,
        });
    });
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const url2 = process.env.EXPO_PUBLIC_IP_EXPO;
    const resetLink = `http://192.168.100.74:8081/resetpassword?email=${encodeURIComponent(email)}`;

    const mailOptions = {
        from: 'jeremy.wanjohi@strathmore.edu',
        to: email,
        subject: 'Password Reset',
        text: `Please reset your password by clicking the following link: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Error sending email' });
        }
        res.status(200).json({ message: 'Reset password email sent. Please check your email.' });
    });
});

app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query('UPDATE users SET hashed_password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error resetting password' });
        }
        res.status(200).json({ message: 'Password reset successfully' });
    });
});

app.post('/change-password', async (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(oldPassword, user.hashed_password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET hashed_password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating password' });
            }
            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
});

app.get('/materials', (req, res) => {
    db.query('SELECT * FROM MaterialCategories', (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

// Endpoint to save recycle data
app.post('/recycle', (req, res) => {
    const { userId, materials } = req.body;
    const queries = materials.map(materialId => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO RecycleData (UserID, CategoryID, RecycleDate) VALUES (?, ?, NOW())',
                [userId, materialId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
        });
    });

    Promise.all(queries)
        .then(results => {
            res.status(200).json({ message: 'Materials recycled successfully.' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while recycling materials.' });
        });
});

app.get('/recycling-centers', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        const query = 'SELECT CenterID, CenterName, Address, Latitude, Longitude FROM recyclingcenters';
        db.query(query, (err, results) => {
            if (err) {
                console.error("Database query error:", err); // Debugging statement
                return res.status(500).json({ error: 'Database query failed' });
            }

            const centers = results.map(center => ({
                ...center,
                Distance: calculateDistance(lat, lng, center.Latitude, center.Longitude)
            }));

            centers.sort((a, b) => a.Distance - b.Distance);
            console.log("Recycling Centers Response: ", centers.slice(0, 5)); // Debugging statement
            res.json(centers.slice(0, 5));
        });
    } catch (error) {
        console.error("Error fetching recycling centers:", error); // Debugging statement
        res.status(500).json({ error: 'An error occurred while fetching recycling centers' });
    }
});

// Endpoint to add a recycling center
app.post('/add-recycling-center', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO recyclingcenters (CenterName, Address, Latitude, Longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ success: true });
    });
});

// Endpoint to remove a recycling center
app.delete('/remove-recycling-center', (req, res) => {
    const { centerId } = req.body;
    const query = 'DELETE FROM recyclingcenters WHERE CenterID = ?';
    db.query(query, [centerId], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Recycling center removed successfully' });
    });
});

// Endpoint to add a weighing entry
app.post('/add-weighing-entry', async (req, res) => {
    const { email, date, materialType, weight, centerId } = req.body;
    const rewardPoints = calculateRewardPoints(materialType, weight);
    const formattedDate = formatDateTime(date);
    const verificationCode = generateVerificationCode();
    const codeExpiry = new Date(new Date().getTime() + 10 * 60000); // Set expiry time (e.g., 10 minutes from now)

    try {
        const [user] = await db.promise().query('SELECT user_id FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user[0].user_id;

        const [materialCategory] = await db.promise().query('SELECT CategoryID FROM materialcategories WHERE CategoryName = ?', [materialType]);

        if (materialCategory.length === 0) {
            return res.status(404).json({ error: 'Material category not found' });
        }

        const categoryId = materialCategory[0].CategoryID;

        const query = 'INSERT INTO recycledata (UserID, CenterID, Weight, PointsEarned, CategoryID, RecycleDate, VerificationCode, CodeExpiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await db.promise().query(query, [userId, centerId, weight, rewardPoints, categoryId, formattedDate, verificationCode, codeExpiry]);
        await db.promise().query('UPDATE users SET points_balance = points_balance + ? WHERE email = ?', [rewardPoints, email]);

        const mailOptions = {
            from: 'jeremy.wanjohi@strathmore.edu',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            }
            res.json({ message: 'Weighing entry added successfully. Verification code sent.', rewardPoints });
        });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/verify-code', (req, res) => {
    const { userId, code } = req.body;

    console.log('Received UserID:', userId);
    console.log('Received code:', code);

    db.query('SELECT VerificationCode, CodeExpiry, PointsEarned FROM recycledata WHERE UserID = ? ORDER BY RecycleID DESC LIMIT 1', [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Verification code not found' });
        }

        const { VerificationCode, CodeExpiry, PointsEarned } = results[0];
        const currentTime = new Date();

        console.log('Stored verification code:', VerificationCode);
        console.log('Stored code expiry:', CodeExpiry);
        console.log('Current time:', currentTime);

        if (!VerificationCode || VerificationCode !== code || currentTime > new Date(CodeExpiry)) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        db.query('UPDATE recycledata SET VerificationCode = NULL, CodeExpiry = NULL WHERE UserID = ? AND VerificationCode = ?', [userId, code], (err, deleteResult) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json({ message: 'Verification successful', rewardPoints: PointsEarned });
        });
    });
});


app.post('/resend-code', (req, res) => {
    const { email } = req.body;
    const newCode = generateVerificationCode(); // Implement this function to generate a new code
    const expiryTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutes from now

    db.query('UPDATE users SET verification_code = ?, code_expiry = ? WHERE email = ?', [newCode, expiryTime, email], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        // Send the new code via email or other means
        res.json({ message: 'New verification code sent' });
    });
});

// Endpoint to get reward points for a user
app.get('/reward-points/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT points_balance FROM users WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ points_balance: results[0].points_balance });
    });
});


// Endpoint to view history
app.get('/view-history/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT * FROM recycledata WHERE UserID = ? ORDER BY RecycleDate DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Endpoint to generate reports
app.get('/generate-report', (req, res) => {
    const { reportType, startDate, endDate } = req.query;

    let query;
    if (reportType === 'Daily') {
        query = 'SELECT DATE(RecycleDate) AS reportDate, SUM(PointsEarned) AS totalPoints FROM recycledata WHERE RecycleDate BETWEEN ? AND ? GROUP BY DATE(RecycleDate)';
    } else if (reportType === 'Weekly') {
        query = 'SELECT WEEK(RecycleDate) AS reportWeek, SUM(PointsEarned) AS totalPoints FROM recycledata WHERE RecycleDate BETWEEN ? AND ? GROUP BY WEEK(RecycleDate)';
    } else if (reportType === 'Monthly') {
        query = 'SELECT MONTH(RecycleDate) AS reportMonth, SUM(PointsEarned) AS totalPoints FROM recycledata WHERE RecycleDate BETWEEN ? AND ? GROUP BY MONTH(RecycleDate)';
    }

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

app.get('/recycling-centers_wl', (req, res) => {
    const query = 'SELECT CenterID, CenterName, Address FROM recyclingcenters';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Fetch best recycling centers based on total weight recycled
// Fetch best performing centers by total weight recycled
app.get('/stats/best-centers-weight', (req, res) => {
    const query = `
        SELECT recyclingcenters.CenterID, recyclingcenters.CenterName, SUM(recycledata.Weight) AS total_weight, COUNT(DISTINCT recycledata.UserID) AS total_users
        FROM recycledata
        JOIN recyclingcenters ON recycledata.CenterID = recyclingcenters.CenterID
        GROUP BY recyclingcenters.CenterID, recyclingcenters.CenterName
        ORDER BY total_weight DESC
        LIMIT 10;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Fetch user registrations per month
app.get('/stats/user-registrations', (req, res) => {
    const query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS registrations
        FROM users
        GROUP BY month
        ORDER BY month;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Fetch material distribution
app.get('/stats/material-distribution', (req, res) => {
    const query = `
        SELECT materialcategories.CategoryName, SUM(recycledata.Weight) AS total_weight
        FROM recycledata
        JOIN materialcategories ON recycledata.CategoryID = materialcategories.CategoryID
        GROUP BY materialcategories.CategoryName
        ORDER BY total_weight DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


app.get('/shops', (req, res) => {
    db.query('SELECT * FROM shops', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


// Endpoint to fetch user's reward points
app.get('/reward-points/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT points_balance FROM users WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});

// Endpoint to redeem points
app.post('/redeem-points', (req, res) => {
    const { userId, shopId, points, email, } = req.body;

    const amount = points * 0.1; // 10 points = 1 Kenyan shilling

    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).json({ error: 'Transaction error' });
        }

        // Update user's points balance
        db.query('UPDATE users SET points_balance = points_balance - ? WHERE user_id = ?', [points, userId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Database query error:', err);
                    res.status(500).json({ error: 'Database query failed' });
                });
            }

            // Insert transaction record
            const query = 'INSERT INTO transactions (user_id, shop_id, points_redeemed, amount_redeemed) VALUES (?, ?, ?, ?)';
            db.query(query, [userId, shopId, points, amount], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Database query error:', err);
                        res.status(500).json({ error: 'Database query failed' });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Commit error:', err);
                            res.status(500).json({ error: 'Transaction commit failed' });
                        });
                    }

                    // Send email notification
                    sendRedemptionEmail(email, points, shopId, amount);

                    res.json({ message: 'Points redeemed successfully', amount });
                });
            });
        });
    });
});

app.get('/shops', (req, res) => {
    db.query('SELECT * FROM shops', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


app.get('/shop-redemptions/:shopId', (req, res) => {
    const { shopId } = req.params;

    const query = `
        SELECT t.transaction_id, t.points_redeemed, t.amount_redeemed, t.transaction_date AS date,
               u.first_name AS firstName, u.last_name AS lastName, u.email
        FROM transactions t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.shop_id = ?
        ORDER BY t.transaction_date DESC
    `;

    db.query(query, [shopId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
