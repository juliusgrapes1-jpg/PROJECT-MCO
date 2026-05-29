const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dynamic Port for Render
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Attendance API is online!');
});

// Temporary memory
let users = []; 
let attendance = [];

// Register: Saves a user
app.post('/api/register', (req, res) => {
    users.push(req.body);
    console.log("User registered:", req.body);
    res.json({ message: "Success!" });
});

// Login: Checks if user exists
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.idnum === username && u.birthdate === password);
    res.json(user ? { success: true } : { success: false, message: "Invalid ID or Birthdate" });
});

// Save Attendance
app.post('/api/attendance', (req, res) => {
    attendance.push(...req.body);
    res.json({ message: "Attendance Saved!" });
});

// Get Records
app.get('/api/records', (req, res) => {
    res.json(attendance);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
