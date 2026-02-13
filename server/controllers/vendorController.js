const Vendor = require('../models/Vendor');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.getAll();
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (
      req.user.systemRole === "VENDOR_USER" &&
      req.user.vendorId !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can only view your own vendor"
      });
    }

    const vendor = await Vendor.getById(id);

    if (!vendor) {
      return res.status(404).json({
        success:false,
        error:'Vendor not found'
      });
    }

    res.json({ success:true, data:vendor });

  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
};


// Create vendor
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (
      req.user.systemRole === "VENDOR_USER" &&
      req.user.vendorId !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can update only your own vendor"
      });
    }

    const vendor = await Vendor.update(id, req.body);

    if (!vendor) {
      return res.status(404).json({
        success:false,
        error:'Vendor not found'
      });
    }

    res.json({ success:true, data:vendor });

  } catch (error) {
    res.status(400).json({
      success:false,
      error:error.message
    });
  }
};


// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const deleted = await Vendor.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
