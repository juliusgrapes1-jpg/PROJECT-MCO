const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// PORT is assigned by Render or defaults to 5000
const PORT = process.env.PORT || 5000;

let users = []; 
let attendance = [];

app.get('/', (req, res) => res.send('API is online!'));

app.post('/api/register', (req, res) => {
    users.push(req.body);
    res.json({ message: "Success!" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.idnum === username && u.birthdate === password);
    res.json(user ? { success: true } : { success: false, message: "Invalid ID or Birthdate" });
});

app.post('/api/attendance', (req, res) => {
    attendance.push(...req.body);
    res.json({ message: "Attendance Saved!" });
});

app.get('/api/records', (req, res) => {
    res.json(attendance);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
