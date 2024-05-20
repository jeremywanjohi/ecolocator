const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cors = require('cors');

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

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jeremy.wanjohi@strathmore.edu',
        pass: 'jkhw wflc pcdd otau',
    },
});

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
            lastName: user.last_name 
        });
    });
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
