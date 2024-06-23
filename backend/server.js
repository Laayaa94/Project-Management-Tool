const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply authentication middleware globally



// MongoDB Connection
mongoose.connect(`mongodb+srv://prabodaharshani95:Mongo94@tasktango.ycn2ati.mongodb.net/tasktango`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
const authRouter = require('./routes/authRoutes');
const projectRouter = require('./routes/projectRoutes');
const teamMembersRouter=require('./routes/teammembersRoutes')
const usersRouter =require('./routes/userRoutes')

app.use('/auth', authRouter); // Authentication routes
app.use('/api/projects', projectRouter); // Project routes
app.use('/api/teammembers', teamMembersRouter);
app.use('/api/users', usersRouter); 




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
