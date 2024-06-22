const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes'); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://prabodaharshani95:Mongo94@tasktango.ycn2ati.mongodb.net/tasktango", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

// Check database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/auth', authRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});