
const express = require('express');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Initiallize express
const app = express();


// Middlewares
// app.use(cors({
//   origin: 'http://localhost:5173', // adjust to your frontend port if needed
//   credentials: true
// }));
app.use(express.json());
app.use(cookieParser());

// Mount authentication routes
app.use('/api/auth', authRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;