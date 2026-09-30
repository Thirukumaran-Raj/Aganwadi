const AnganwadiCentre = require('../models/AnganwadiCentre');
const mongoose = require('mongoose');

const centreFields = [
  'awcId', 'awcCode', 'centreName', 'state', 'district', 'block', 'sector',
  'village', 'address', 'pinCode', 'latitude', 'longitude', 'centreType',
  'openingDate', 'status', 'infrastructure',
];
const centreStatuses = ['Active', 'Inactive', 'Under Review', 'Deactivated'];

const validateCentrePayload = (body, partial = false) => {
  const unsupportedFields = Object.keys(body).filter((key) => !centreFields.includes(key));
  if (unsupportedFields.length) return `Unsupported field: ${unsupportedFields[0]}`;

  for (const field of ['awcId', 'centreName']) {
    if ((!partial || body[field] !== undefined) && (typeof body[field] !== 'string' || !body[field].trim())) {
      return `${field} is required`;
    }
  }

  for (const field of centreFields) {
    const value = body[field];
    if (value === undefined || value === null || field === 'infrastructure') continue;
    if (['latitude', 'longitude'].includes(field)) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return `${field} must be a valid number`;
      if (field === 'latitude' && (value < -90 || value > 90)) return 'Latitude must be between -90 and 90';
      if (field === 'longitude' && (value < -180 || value > 180)) return 'Longitude must be between -180 and 180';
      continue;
    }
    if (field === 'openingDate') {
      if (Number.isNaN(new Date(value).getTime())) return 'Opening date must be valid';
      continue;
    }
    if (field === 'status') {
      if (!centreStatuses.includes(value)) return 'Invalid centre status';
      continue;
    }
    if (typeof value !== 'string') return `${field} must be text`;
    if (value.trim().length > 200) return `${field} must be 200 characters or fewer`;
  }

  if (body.infrastructure !== undefined) {
    if (!body.infrastructure || typeof body.infrastructure !== 'object' || Array.isArray(body.infrastructure)) {
      return 'Infrastructure must be an object';
    }
    if (Object.values(body.infrastructure).some((value) => typeof value !== 'boolean')) {
      return 'Infrastructure values must be true or false';
    }
  }

  return null;
};

const getCentres = async (req, res) => {
  try {
    const { status, district, block } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (district) filter.district = { $regex: district, $options: 'i' };
    if (block) filter.block = { $regex: block, $options: 'i' };

    const centres = await AnganwadiCentre.find(filter).sort({ createdAt: -1 });
    res.status(200).json(centres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCentreById = async (req, res) => {
  try {
    const centre = await AnganwadiCentre.findById(req.params.id);
    if (!centre) {
      return res.status(404).json({ message: 'Centre not found' });
    }

    res.status(200).json(centre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCentre = async (req, res) => {
  try {
    const validationError = validateCentrePayload(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const centre = await AnganwadiCentre.create({
      ...req.body,
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json(centre);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'A centre with this AWC ID already exists' : error.message,
    });
  }
};

const updateCentre = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid centre ID' });
    }
    const validationError = validateCentrePayload(req.body, true);
    if (validationError) return res.status(400).json({ message: validationError });

    const centre = await AnganwadiCentre.findById(req.params.id);
    if (!centre) {
      return res.status(404).json({ message: 'Centre not found' });
    }

    Object.entries(req.body).forEach(([key, value]) => {
      centre[key] = typeof value === 'string' ? value.trim() : value;
    });

    if (req.body.infrastructure) {
      centre.infrastructure = { ...centre.infrastructure, ...req.body.infrastructure };
    }

    await centre.save();
    res.status(200).json(centre);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? 'A centre with this AWC ID already exists' : error.message,
    });
  }
};

module.exports = {
  getCentres,
  getCentreById,
  createCentre,
  updateCentre,
};
