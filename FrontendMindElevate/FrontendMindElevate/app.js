const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory user store
const users = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Render the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    req.session.user = { username };
    res.redirect('/registeredHome');
});

// Render the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { username };
        res.redirect('/registeredHome');
    } else {
        res.redirect('/login?error=1'); // Add query parameter for error
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index.html');
    });
});

// Render home page (protected)
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'home.html'));
    } else {
        res.redirect('/login');
    }
});

// Render registered home page (protected)
app.get('/registeredHome', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'registeredHome.html'));
    } else {
        res.redirect('/login');
    }
});


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));


// Render self-assessment page
app.get('/self-assessment', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'FrontendMindElevate', 'quiz', 'self-assessment.html'));
    } else {
        res.redirect('/login');
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});