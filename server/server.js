const express = require('express');
const cors = require('cors');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const vendorUserRoutes = require('./routes/vendorUserRoutes');
const societyRoutes = require('./routes/societyRoutes');
const societyUserRoutes = require('./routes/societyUserRoutes');
const authRoutes = require('./routes/authRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const crmDashboardRoutes = require('./routes/crmDashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/vendor-users', vendorUserRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/society-users', societyUserRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/crm', crmDashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PartnerGrid API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




