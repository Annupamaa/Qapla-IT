const pool = require("../config/database");

exports.getAdminDashboard = async (req, res) => {
    try {
        const [[vendors]] = await pool.query(
            "SELECT COUNT(*) AS count FROM vendors"
        );

        const [[societies]] = await pool.query(
            "SELECT COUNT(*) AS count FROM societies"
        );

        const [[vendorUsers]] = await pool.query(
            "SELECT COUNT(*) AS count FROM vendor_users"
        );

        const [[societyUsers]] = await pool.query(
            "SELECT COUNT(*) AS count FROM society_users"
        );

        const [[systemUsers]] = await pool.query(
            "SELECT COUNT(*) AS count FROM system_users"
        );

        res.json({
            success: true,
            data: {
                totalVendors: vendors.count,
                totalSocieties: societies.count,
                totalVendorUsers: vendorUsers.count,
                totalSocietyUsers: societyUsers.count,
                totalSystemUsers: systemUsers.count
            }
        });

    } catch (err) {
        console.error("ADMIN DASHBOARD ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
