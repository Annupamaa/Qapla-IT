const pool = require("../config/database");

exports.getMyProfile = async (req, res) => {
  if (req.user.type !== "society") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const [rows] = await pool.query(
    `SELECT 
        id,
        society_id,
        email,
        full_name,
        mobile_country_code,
        mobile_number,
        role,
        is_authorized_signatory,
        approval_limit_amount
     FROM society_users
     WHERE id = ? AND is_active = 1`,
    [req.user.id],
  );

  if (!rows.length) {
    return res
      .status(404)
      .json({ success: false, message: "Profile not found" });
  }

  res.json({ success: true, data: rows[0] });
};

exports.updateMyProfile = async (req, res) => {
  if (req.user.type !== "society") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const { full_name, mobile_country_code, mobile_number } = req.body;

  const [result] = await pool.query(
    `UPDATE society_users
     SET full_name = ?, mobile_country_code = ?, mobile_number = ?
     WHERE id = ?`,
    [full_name, mobile_country_code, mobile_number, req.user.id],
  );

  if (!result.affectedRows) {
    return res.status(400).json({ success: false, message: "Update failed" });
  }

  res.json({ success: true, message: "Profile updated successfully" });
};
