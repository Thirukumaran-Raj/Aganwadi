const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');
const mongoose = require('mongoose');

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const centreRoutes = require('./routes/centreRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const growthRoutes = require('./routes/growthRoutes');
const userRoutes = require('./routes/userRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/centres', centreRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

app.get('/', (req, res) => {
  res.send('Anganwadi Portal API is running smoothly...');
});

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();