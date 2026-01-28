const Society = require('../models/Society');

// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.getAll();
    res.json({ success: true, data: societies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get society by ID
exports.getSocietyById = async (req, res) => {
  try {
    const society = await Society.getById(req.params.id);
    if (!society) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    res.json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create society
exports.createSociety = async (req, res) => {
  try {
    const society = await Society.create(req.body);
    res.status(201).json({ success: true, data: society });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update society
exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.update(req.params.id, req.body);
    if (!society) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    res.json({ success: true, data: society });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete society
exports.deleteSociety = async (req, res) => {
  try {
    const deleted = await Society.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    res.json({ success: true, message: 'Society deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




