const VendorUser = require('../models/VendorUser');

// Get all vendor users
exports.getAllVendorUsers = async (req, res) => {
  try {
    let vendorId = req.query.vendor_id || null;

    // If logged-in vendor user → force own vendor only
    if (req.user.systemRole === "VENDOR_USER") {
      vendorId = req.user.vendorId;
    }

    const users = await VendorUser.getAll(vendorId);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor user by ID
exports.getVendorUserById = async (req, res) => {
  try {
    let id = req.params.id;

    // Vendor user can only read themselves
    if (req.user.systemRole === "VENDOR_USER") {
      id = req.user.id;
    }

    const user = await VendorUser.getById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Vendor user not found'
      });
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
    let id = req.params.id;

    // Vendor user can only update themselves
    if (req.user.systemRole === "VENDOR_USER") {
      id = req.user.id;
    }

    const user = await VendorUser.update(id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Vendor user not found'
      });
    }

    res.json({ success: true, data: user });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await VendorUser.getById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const user = await VendorUser.update(req.user.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

// Delete vendor user
exports.deleteVendorUser = async (req, res) => {
  try {
    const deleted = await VendorUser.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Vendor user not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor user deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
