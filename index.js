const express = require('express');

const cookieParser = require('cookie-parser');

const {restrictUnAuthorisedUser} = require('./middlewares/auth');

const cors = require('cors');

const app = express();

const PORT = 8000;

// Allow requests from your React app's origin (http://localhost:8000)
app.use(cors({
    origin: `http://localhost:5173`, // React's dev server URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(cookieParser());

const userRouter = require('./routes/user');

const eventRouter = require('./routes/event');

const userSignup = require('./routes/signup');

const userLogin = require('./routes/login');

const {logReqRes} = require('./middlewares');

const {connectMongoDb} = require('./connection');
// Connection
connectMongoDb('mongodb://127.0.0.1:27017/event-node-app');

// Middleware to parse form urlencoded data
app.use(express.urlencoded({extended: false}));

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());

app.use(logReqRes('log.txt'));

// Routes
app.use("/api/signup", userSignup);

app.use("/api/login", userLogin);

app.use("/api/user", restrictUnAuthorisedUser);

app.use("/api/user", userRouter);

app.use("/api/event", restrictUnAuthorisedUser);

app.use("/api/event", eventRouter);

app.listen(PORT, () => console.log('Server started at ', PORT));