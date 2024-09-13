require('dotenv/config');
require('./db/db');
const express = require('express');
const cors = require('cors');
const { isAuthenticated } = require('./middleware/jwt.middleware')

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply other configurations
require('./config/config')(app);

// Routes


const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

const allRoutes = require('./routes');
app.use('/api', allRoutes);

const projectRouter = require('./routes/project.routes');
app.use('/api/projects', isAuthenticated, projectRouter);

const taskRouter = require('./routes/task.routes');
app.use('/api/tasks', isAuthenticated, taskRouter);


// Error handling
require('./error-handling/error.handling')(app);

module.exports = app;