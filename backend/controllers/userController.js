const mongoose = require('mongoose');
const User = require('../models/User');
const AnganwadiCentre = require('../models/AnganwadiCentre');
const AuditLog = require('../models/AuditLog');

const roles = ['admin', 'supervisor', 'worker'];
const statuses = ['Active', 'Inactive', 'Suspended', 'Transferred'];
const editableFields = [
  'name', 'email', 'password', 'role', 'status', 'assignedCentre', 'centerId',
  'employeeId', 'mobile', 'state', 'district', 'block', 'sector',
];

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  assignedCentre: user.assignedCentre,
  centerId: user.centerId,
  employeeId: user.employeeId,
  mobile: user.mobile,
  state: user.state,
  district: user.district,
  block: user.block,
  sector: user.sector,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

const validateStaffPayload = async (body, partial = false) => {
  const unsupportedField = Object.keys(body).find((field) => !editableFields.includes(field));
  if (unsupportedField) return `Unsupported field: ${unsupportedField}`;

  if ((!partial || body.name !== undefined) && (typeof body.name !== 'string' || !body.name.trim())) {
    return 'Name is required';
  }
  if ((!partial || body.email !== undefined) && (typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email.trim()))) {
    return 'A valid email address is required';
  }
  if (!partial && (typeof body.password !== 'string' || body.password.length < 12)) {
    return 'Password must be at least 12 characters';
  }
  if (body.password !== undefined && (typeof body.password !== 'string' || body.password.length < 12)) {
    return 'Password must be at least 12 characters';
  }
  if (body.role !== undefined && !roles.includes(body.role)) return 'Role must be admin, supervisor, or worker';
  if (body.status !== undefined && !statuses.includes(body.status)) return 'Invalid account status';

  for (const field of editableFields) {
    const value = body[field];
    if (value === undefined || value === null || value === '' || ['password', 'role', 'status', 'assignedCentre'].includes(field)) continue;
    if (field === 'email') continue;
    if (field === 'centerId' || field === 'employeeId' || field === 'mobile') {
      if (typeof value !== 'string' || value.trim().length > 40) return `${field} must be 40 characters or fewer`;
      if (field === 'mobile' && !/^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, ''))) {
        return 'Mobile number must contain 10 to 15 digits';
      }
      continue;
    }
    if (typeof value !== 'string' || value.trim().length > 120) return `${field} must be 120 characters or fewer`;
  }

  if (body.assignedCentre) {
    if (!mongoose.isValidObjectId(body.assignedCentre)) return 'Invalid centre assignment';
    if (!(await AnganwadiCentre.exists({ _id: body.assignedCentre }))) return 'Assigned centre was not found';
  }

  return null;
};

const writeAudit = async (req, action, user, details) => {
  await AuditLog.create({
    user: req.user._id,
    action,
    entity: 'User',
    entityId: String(user._id),
    details,
    ipAddress: req.ip,
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -permissions -documents')
      .populate('assignedCentre', 'centreName awcId awcCode')
      .sort({ createdAt: -1 });
    res.status(200).json(users.map(publicUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const validationError = await validateStaffPayload(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const user = await User.create({
      ...req.body,
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      role: req.body.role || 'worker',
      status: req.body.status || 'Active',
      assignedCentre: req.body.assignedCentre || null,
    });
    await writeAudit(req, 'staff.created', user, { role: user.role, status: user.status });
    await user.populate('assignedCentre', 'centreName awcId awcCode');
    res.status(201).json(publicUser(user));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'An account with this email already exists' : error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid staff ID' });
    if (Object.keys(req.body).length === 0) return res.status(400).json({ message: 'At least one field is required' });
    const validationError = await validateStaffPayload(req.body, true);
    if (validationError) return res.status(400).json({ message: validationError });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Staff member not found' });

    const willDemoteOrDeactivate = user.role === 'admin' && user.status === 'Active'
      && ((req.body.role && req.body.role !== 'admin') || (req.body.status && req.body.status !== 'Active'));
    if (willDemoteOrDeactivate && await User.countDocuments({ role: 'admin', status: 'Active', _id: { $ne: user._id } }) === 0) {
      return res.status(409).json({ message: 'The last active administrator cannot be demoted or deactivated' });
    }

    Object.entries(req.body).forEach(([field, value]) => {
      user[field] = typeof value === 'string' && field !== 'password' ? value.trim() : value;
    });
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.assignedCentre === '') user.assignedCentre = null;

    await user.save();
    await writeAudit(req, 'staff.updated', user, { fields: Object.keys(req.body).filter((field) => field !== 'password') });
    await user.populate('assignedCentre', 'centreName awcId awcCode');
    res.status(200).json(publicUser(user));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'An account with this email already exists' : error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid staff ID' });
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Staff member not found' });

    if (user.role === 'admin' && user.status === 'Active') {
      const activeAdminCount = await User.countDocuments({ role: 'admin', status: 'Active' });
      if (activeAdminCount <= 1) {
        return res.status(409).json({ message: 'The last active administrator cannot be deleted' });
      }
    }

    await user.deleteOne();
    await writeAudit(req, 'staff.deleted', user, {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ message: 'Staff account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };