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

  try {
    // ✅ Check vendor users first
    const [vendorRows] = await pool.query(
      `SELECT id, password_hash, role, is_first_login
       FROM vendor_users
       WHERE email = ? AND is_active = 1`,
      [email]
    );

    // ✅ If not vendor → check society
    const [societyRows] = vendorRows.length
      ? [[]]
      : await pool.query(
          `SELECT id, password_hash, role, is_first_login
           FROM society_users
           WHERE email = ? AND is_active = 1`,
          [email]
        );

    const user = vendorRows[0] || societyRows[0];
    const userType = vendorRows.length ? "vendor" : "society";

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Password check
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // ✅ First login → force password change
    if (user.is_first_login) {
      const tempToken = jwt.sign(
        { id: user.id, role: user.role, type: userType },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({
        success: true,
        firstLogin: true,
        token: tempToken,
      });
    }

    // ✅ Create token
    const token = jwt.sign(
      { id: user.id, role: user.role, type: userType },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ⭐⭐⭐ THIS IS THE IMPORTANT PART ⭐⭐⭐
    let redirectTo = "/";

// ⭐ Admin & CRM first
if (user.role === "admin") {
  redirectTo = "/admin";

} else if (user.role === "crm_vendor") {
  redirectTo = "/crm-vendor";

} else if (user.role === "crm_society") {
  redirectTo = "/crm-society";

}

// ⭐ Now decide dashboard from TABLE (userType)
else if (userType === "vendor") {
  redirectTo = "/vendor/dashboard";

} else if (userType === "society") {
  redirectTo = "/society/dashboard";
}


    // ✅ Send response
    return res.json({
      success: true,
      token,
      firstLogin: false,
      role: user.role,
      userType,
      redirectTo,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/**
 * CHANGE PASSWORD
 */
const changePassword = async (req, res) => {
  const { newPassword } = req.body;

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
