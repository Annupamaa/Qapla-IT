const VendorUser = require('../models/VendorUser');

// Get all vendor users
exports.getAllVendorUsers = async (req, res) => {
  try {
    const vendorId = req.query.vendor_id || null;
    const users = await VendorUser.getAll(vendorId);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor user by ID
exports.getVendorUserById = async (req, res) => {
  try {
    const user = await VendorUser.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Vendor user not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create vendor user
exports.createVendorUser = async (req, res) => {
  try {
    const user = await VendorUser.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update vendor user
exports.updateVendorUser = async (req, res) => {
  try {
    const user = await VendorUser.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Vendor user not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete vendor user
exports.deleteVendorUser = async (req, res) => {
  try {
    const deleted = await VendorUser.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Vendor user not found' });
    }
    res.json({ success: true, message: 'Vendor user deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




