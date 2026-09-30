const GrowthMeasurement = require('../models/GrowthMeasurement');
const Child = require('../models/Child');

const getGrowthRecords = async (req, res) => {
  try {
    const { childId } = req.query;
    const filter = {};

    if (childId) filter.child = childId;

    const records = await GrowthMeasurement.find(filter)
      .populate('child', 'name')
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGrowthRecord = async (req, res) => {
  try {
    const { child, date, ageInMonths, height, weight, muac, status, remarks, recordedBy } = req.body;

    if (!child) {
      return res.status(400).json({ message: 'Child ID is required' });
    }

    const record = await GrowthMeasurement.create({
      child,
      date: date || new Date(),
      ageInMonths: ageInMonths || 0,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      muac: muac !== undefined && muac !== null && muac !== '' ? Number(muac) : null,
      status: status || 'Normal',
      remarks: remarks || '',
      recordedBy: recordedBy || (req.user ? req.user._id : null),
    });

    const childDoc = await Child.findById(child);
    if (childDoc) {
      childDoc.growthStatus = status || childDoc.growthStatus || 'Normal';
      childDoc.healthLogs.unshift({
        date: record.date,
        weight: record.weight,
        height: record.height,
        muac: record.muac,
        status: record.status,
        notes: remarks || `Growth tracking update on ${new Date(record.date).toLocaleDateString()}`,
      });
      await childDoc.save();
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateGrowthRecord = async (req, res) => {
  try {
    const { date, ageInMonths, height, weight, muac, status, remarks } = req.body;
    const record = await GrowthMeasurement.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Growth record not found' });
    }

    record.date = date || record.date;
    record.ageInMonths = ageInMonths !== undefined ? ageInMonths : record.ageInMonths;
    record.height = height !== undefined ? Number(height) : record.height;
    record.weight = weight !== undefined ? Number(weight) : record.weight;
    record.muac = muac !== undefined && muac !== null && muac !== '' ? Number(muac) : null;
    record.status = status || record.status;
    record.remarks = remarks !== undefined ? remarks : record.remarks;

    await record.save();
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGrowthRecord = async (req, res) => {
  try {
    const record = await GrowthMeasurement.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Growth record not found' });
    }

    await record.deleteOne();

    const childDoc = await Child.findById(record.child);
    if (childDoc) {
      childDoc.healthLogs = (childDoc.healthLogs || []).filter((log) => {
        const logDate = log.date ? new Date(log.date).getTime() : null;
        return logDate !== new Date(record.date).getTime();
      });
      await childDoc.save();
    }

    res.status(200).json({ message: 'Growth record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGrowthRecords,
  createGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
};
