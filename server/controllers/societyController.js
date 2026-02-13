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
    const id = Number(req.params.id);

    //  ownership check
    if (
      req.user.systemRole === "SOCIETY_USER" &&
      req.user.societyId !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can view only your society"
      });
    }

    const society = await Society.getById(id);

    if (!society) {
      return res.status(404).json({
        success:false,
        error:'Society not found'
      });
    }

    res.json({ success:true, data:society });

  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    });
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
    const id = Number(req.params.id);

    //  ownership check
    if (
      req.user.systemRole === "SOCIETY_USER" &&
      req.user.societyId !== id
    ) {
      return res.status(403).json({
        success:false,
        message:"You can update only your society"
      });
    }

    const society = await Society.update(id, req.body);

    if (!society) {
      return res.status(404).json({
        success:false,
        error:'Society not found'
      });
    }

    res.json({ success:true, data:society });

  } catch (error) {
    res.status(400).json({
      success:false,
      error:error.message
    });
  }
};

exports.getMySociety = async (req,res)=>{
  const society = await Society.getById(req.user.societyId);
  res.json({success:true,data:society});
};

exports.updateMySociety = async (req,res)=>{
  const society = await Society.update(req.user.societyId, req.body);
  res.json({success:true,data:society});
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
