const express = require('express');
const cookieParser = require('cookie-parser');
const {checkForAuthentication} = require('./middlewares/auth');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.use(cookieParser());

const userRouter = require('./routes/user');

const eventRouter = require('./routes/event');

const userSignup = require('./routes/signup');

const userLogin = require('./routes/login');

const {logReqRes} = require('./middlewares');

const {connectMongoDb} = require('./connection');
const { uploadFile } = require('./controllers/uploadController');

// Middleware to parse form urlencoded data
app.use(express.urlencoded({extended: false}));

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());

app.use(logReqRes('log.txt'));

// Serve static files from "events" directory
app.use("/events", express.static("events"));

// Routes
app.use("/api/signup", userSignup);

app.use("/api/login", userLogin);

app.use("/api/user", checkForAuthentication, userRouter);

app.use("/api/event", checkForAuthentication, eventRouter);

app.use("/upload", uploadFile);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Connection
connectMongoDb(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event-node-app');

app.listen(PORT, () => console.log('Server started at ', PORT));