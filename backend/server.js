const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const User=require('./models/User');

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
const taskRouter=require('./routes/taskRoutes')
const notifiRouter=require('./routes/notificationroutes')

app.use('/auth', authRouter); // Authentication routes
app.use('/api/projects', projectRouter); // Project routes
app.use('/api/teammembers', teamMembersRouter);
app.use('/api/users', usersRouter); 
app.use('/api/tasks',taskRouter);
app.use('/api/notification',notifiRouter)


// Ensure upload directory exists
const uploadDir = './uploads/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serving uploaded images statically
app.use('/images', express.static(uploadDir));

// Endpoint to update user profile photo
app.post('/api/users/:userId/profile', upload.single('profilePhoto'), (req, res) => {
    const { userId } = req.params;

    // Logic to update user's profile photo in the database
    // Assuming you have a User model and you're updating the profilePhoto field

    // Example: Update user profile photo path in the database
    User.findByIdAndUpdate(userId, { profilePhoto: req.file.path }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                success: true,
                message: 'Profile photo updated successfully',
                user
            });
        })
        .catch(error => {
            console.error('Error updating profile photo:', error);
            res.status(500).json({ message: 'Failed to update profile photo', error: error.message });
        });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
