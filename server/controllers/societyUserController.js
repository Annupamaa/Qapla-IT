const SocietyUser = require('../models/SocietyUser');

// Get all society users
exports.getAllSocietyUsers = async (req, res) => {
  try {
    let societyId = req.query.society_id || null;

    // If logged-in society user → only their society
    if (req.user.systemRole === "SOCIETY_USER") {
      societyId = req.user.societyId;
    }

    const users = await SocietyUser.getAll(societyId);

    res.json({ success: true, data: users });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get society user by ID
exports.getSocietyUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (
      req.user.systemRole === "SOCIETY_USER" &&
      req.user.id !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can only view your own profile"
      });
    }

    const user = await SocietyUser.getById(id);

    if (!user) {
      return res.status(404).json({
        success:false,
        error:'Society user not found'
      });
    }

    res.json({ success:true, data:user });

  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
};


// Create society user
exports.createSocietyUser = async (req, res) => {
  try {
    const user = await SocietyUser.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update society user
exports.updateSocietyUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (
      req.user.systemRole === "SOCIETY_USER" &&
      req.user.id !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can update only your own profile"
      });
    }

    const user = await SocietyUser.update(id, req.body);

    if (!user) {
      return res.status(404).json({
        success:false,
        error:'Society user not found'
      });
    }

    res.json({ success:true, data:user });

  } catch (error) {
    res.status(400).json({
      success:false,
      error:error.message
    });
  }
};

// Delete society user
exports.deleteSocietyUser = async (req, res) => {
  try {
    const deleted = await SocietyUser.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Society user not found'
      });
    }

    res.json({
      success: true,
      message: 'Society user deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
