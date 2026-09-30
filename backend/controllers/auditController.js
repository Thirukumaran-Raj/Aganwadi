const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 25;
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      AuditLog.countDocuments(),
    ]);

    res.status(200).json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuditLogs };