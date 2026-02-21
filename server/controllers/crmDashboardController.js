const Vendor = require('../models/Vendor');
const VendorUser = require('../models/VendorUser');
const Society = require('../models/Society');
const SocietyUser = require('../models/SocietyUser');


// =========================
// CRM VENDOR DASHBOARD
// =========================
exports.vendorDashboard = async (req, res) => {
    try {
        const totalVendors = await Vendor.countAll();
        const totalVendorUsers = await VendorUser.countAll();

        res.json({
            success: true,
            data: {
                totalVendors,
                totalVendorUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// =========================
// CRM SOCIETY DASHBOARD
// =========================
exports.societyDetails = async (req, res) => {
    try {
        const totalSocieties = await Society.countAll();
        const totalSocietyUsers = await SocietyUser.countAll();

        res.json({
            success: true,
            data: {
                totalSocieties,
                totalSocietyUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
