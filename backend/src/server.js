require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// debug stuff 
app.use((req, res, next) => {
  console.log('Request received: ');
  console.log('Method: ', req.method);
  console.log('URL: ', req.url);
  console.log('Headers: ', req.headers);
  console.log('Body: ', req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});