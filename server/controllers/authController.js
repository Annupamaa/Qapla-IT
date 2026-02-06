const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * LOGIN
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  // Check vendor users
  const [vendorRows] = await pool.query(
    `SELECT id, vendor_id, password_hash, role, is_first_login
     FROM vendor_users
     WHERE email = ? AND is_active = 1`,
    [email],
  );

  // Check society users if not vendor
  const [societyRows] = vendorRows.length
    ? [[]]
    : await pool.query(
      `SELECT id, password_hash, role, is_first_login
         FROM society_users
         WHERE email = ? AND is_active = 1`,
        [email],
    );

  const user = vendorRows[0] || societyRows[0];
  const userType = vendorRows.length ? "vendor" : "society";

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

  // First login → temporary token for password change
  if (user.is_first_login) {
    const tempToken = jwt.sign(
      { id: user.id, role: user.role, type: userType },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    return res.json({
      success: true,
      firstLogin: true,
      token: tempToken,
    });
  }

  // Normal login → go to dashboard
  const token = jwt.sign(
    { id: user.id, role: user.role, type: userType },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  return res.json({
    success: true,
    token,
    firstLogin: false,
    redirectTo:
      userType === "vendor"
        ? `/vendor-dashboard/${user.vendor_id}`
        : `/society-dashboard/${user.society_id}`,
  });
};

/**
 * CHANGE PASSWORD
 */
const changePassword = async (req, res) => {
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
  if (decoded.type === "vendor") {
    query = `UPDATE vendor_users SET password_hash = ?, is_first_login = 0 WHERE id = ?`;
  } else {
    query = `UPDATE society_users SET password_hash = ?, is_first_login = 0 WHERE id = ?`;
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
};

module.exports = { login, changePassword };
