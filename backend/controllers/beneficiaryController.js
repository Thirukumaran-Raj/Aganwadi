const Beneficiary = require('../models/Beneficiary');
const AnganwadiCentre = require('../models/AnganwadiCentre');
const mongoose = require('mongoose');

const beneficiaryFields = [
  'beneficiaryId', 'name', 'category', 'gender', 'dob', 'age', 'fatherName',
  'motherName', 'guardian', 'mobile', 'address', 'state', 'district', 'block',
  'village', 'awc', 'registrationDate', 'status', 'photo',
];
const beneficiaryCategories = ['Child', 'Pregnant Woman', 'Lactating Mother', 'Adolescent Girl'];
const beneficiaryGenders = ['Male', 'Female', 'Other'];
const beneficiaryStatuses = ['Active', 'Inactive', 'Transferred', 'Deactivated'];

const validateBeneficiaryPayload = (body, partial = false) => {
  const unsupportedFields = Object.keys(body).filter((key) => !beneficiaryFields.includes(key));
  if (unsupportedFields.length) return `Unsupported field: ${unsupportedFields[0]}`;

  if ((!partial || body.name !== undefined) && (typeof body.name !== 'string' || !body.name.trim())) {
    return 'Name is required';
  }

  for (const [field, allowedValues] of Object.entries({
    category: beneficiaryCategories,
    gender: beneficiaryGenders,
    status: beneficiaryStatuses,
  })) {
    if (body[field] !== undefined && !allowedValues.includes(body[field])) return `Invalid ${field}`;
  }

  for (const field of beneficiaryFields) {
    const value = body[field];
    if (value === undefined || value === null || value === '' || ['category', 'gender', 'status'].includes(field)) continue;
    if (field === 'dob' || field === 'registrationDate') {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return `${field} must be a valid date`;
      if (field === 'dob' && date > new Date()) return 'Date of birth cannot be in the future';
      continue;
    }
    if (field === 'age') {
      if (!Number.isInteger(Number(value)) || Number(value) < 0 || Number(value) > 120) return 'Age must be a whole number between 0 and 120';
      continue;
    }
    if (field === 'awc') {
      if (!mongoose.isValidObjectId(value)) return 'Invalid centre selection';
      continue;
    }
    if (field === 'mobile') {
      if (!/^\+?[0-9]{10,15}$/.test(String(value).replace(/[\s()-]/g, ''))) return 'Mobile number must contain 10 to 15 digits';
      continue;
    }
    if (typeof value !== 'string') return `${field} must be text`;
    if (value.trim().length > 200) return `${field} must be 200 characters or fewer`;
  }

  return null;
};

const getBeneficiaries = async (req, res) => {
  try {
    const { category, status, awc } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (awc) filter.awc = awc;

    const beneficiaries = await Beneficiary.find(filter)
      .populate('awc', 'centreName awcCode')
      .sort({ createdAt: -1 });

    res.status(200).json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id).populate('awc', 'centreName awcCode');
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.status(200).json(beneficiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBeneficiary = async (req, res) => {
  try {
    const validationError = validateBeneficiaryPayload(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const beneficiaryId = req.body.beneficiaryId || `BEN-${Date.now()}`;

    if (req.body.awc && !(await AnganwadiCentre.exists({ _id: req.body.awc }))) {
      return res.status(400).json({ message: 'Selected centre was not found' });
    }

    const beneficiary = await Beneficiary.create({
      ...req.body,
      beneficiaryId,
      registeredBy: req.user ? req.user._id : null,
    });

    res.status(201).json(beneficiary);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'A beneficiary with this ID already exists' : error.message,
    });
  }
};

const updateBeneficiary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid beneficiary ID' });
    }
    const validationError = validateBeneficiaryPayload(req.body, true);
    if (validationError) return res.status(400).json({ message: validationError });

    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    if (req.body.awc && !(await AnganwadiCentre.exists({ _id: req.body.awc }))) {
      return res.status(400).json({ message: 'Selected centre was not found' });
    }

    Object.entries(req.body).forEach(([key, value]) => {
      beneficiary[key] = typeof value === 'string' ? value.trim() : value;
    });

    await beneficiary.save();
    res.status(200).json(await beneficiary.populate('awc', 'centreName awcCode'));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'A beneficiary with this ID already exists' : error.message,
    });
  }
};

module.exports = {
  getBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
};
