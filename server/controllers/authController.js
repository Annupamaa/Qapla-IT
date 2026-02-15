const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

//----Login----
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check system users (ADMIN / CRM)
    const [systemRows] = await pool.query(
      `SELECT id, password_hash, role, is_first_login
       FROM system_users
       WHERE email = ? AND is_active = 1`,
      [email]
    );

    // Check vendor users
    const [vendorRows] = await pool.query(
      `SELECT id, vendor_id, password_hash, role, is_first_login
     FROM vendor_users
     WHERE email = ? AND is_active = 1`,
      [email],
    );

    // Check society users if not vendor
    const [societyRows] = await pool.query(
      `SELECT id, society_id, password_hash, role, is_first_login
     FROM society_users
     WHERE email = ? AND is_active = 1`,
      [email]
    );


    // ----- detect user -----
    let user = null;
    let userType = null;

    if (systemRows.length) {
      user = systemRows[0];
      userType = "system";
    } else if (vendorRows.length) {
      user = vendorRows[0];
      userType = "vendor";
    } else if (societyRows.length) {
      user = societyRows[0];
      userType = "society";
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // ----- roles -----
    let systemRole = null;
    let subRole = user.role ? user.role.toUpperCase() : null;   // ⭐ FIX

    if (userType === "system") systemRole = user.role ? user.role.toUpperCase() : null; // ⭐ FIX
    if (userType === "vendor") systemRole = "VENDOR_USER";
    if (userType === "society") systemRole = "SOCIETY_USER";

    // First login → temporary token for password change
    if (user.is_first_login) {
      const tempToken = jwt.sign(
        { id: user.id, systemRole, subRole, type: userType },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({
        success: true,
        firstLogin: true,
        token: tempToken
      });
    }

    // Normal login → go to dashboard
    const token = jwt.sign(
      {
        id: user.id,
        systemRole,
        subRole,
        type: userType,
        vendorId: user.vendor_id || null,
        societyId: user.society_id || null
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    let redirectTo = "/";

    if (systemRole === "ADMIN") redirectTo = "/admin-dashboard";
    if (systemRole === "CRM_VENDOR") redirectTo = "/crm-vendor-dashboard";
    if (systemRole === "CRM_SOCIETY") redirectTo = "/crm-society-dashboard";

    if (userType === "vendor")
      redirectTo = `/vendor-dashboard/${user.vendor_id}`;
    crm-vendor-dashboard
    if (userType === "society")
      redirectTo = `/society-dashboard/${user.society_id}`;

    return res.json({
      success: true,
      token,
      firstLogin: false,
      systemRole,
      subRole,
      redirectTo
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//-----Change Password------
const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const decoded = req.user;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let query;

    if (decoded.type === "system") {
      query = `UPDATE system_users 
             SET password_hash = ?, is_first_login = 0 
             WHERE id = ?`;
    }
    else if (decoded.type === "vendor") {
      query = `UPDATE vendor_users 
             SET password_hash = ?, is_first_login = 0 
             WHERE id = ?`;
    }
    else if (decoded.type === "society") {
      query = `UPDATE society_users 
             SET password_hash = ?, is_first_login = 0 
             WHERE id = ?`;
    }

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type"
      });
    }

    const [result] = await pool.query(query, [hashedPassword, decoded.id]);

    if (!result.affectedRows) {
      return res.status(400).json({
        success: false,
        message: "Password update failed",
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { login, changePassword };
