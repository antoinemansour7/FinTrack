require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require("./routes/chatRoutes");
const plaidRoutes = require('./routes/plaidRoutes'); // Adjust the path if needed
const insightsRoutes = require('./routes/insightsRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/plaid', plaidRoutes); // Add Plaid routes
app.use("/api/chat", chatRoutes);
app.use('/api/insights', insightsRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));