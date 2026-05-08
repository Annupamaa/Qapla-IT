// Import database connection pool
const pool = require("../config/database");

/*
  Controller to fetch logged-in society user's profile
*/
exports.getMyProfile = async (req, res) => {

  // Check whether logged-in user belongs to society type
  if (req.user.type !== "society") {

    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  // Query to fetch active society user profile
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

  // Check if profile exists
  if (!rows.length) {

    return res
      .status(404)
      .json({
        success: false,
        message: "Profile not found"
      });
  }

  // Send profile data in response
  res.json({
    success: true,
    data: rows[0]
  });
};

/*
  Controller to update logged-in society user's profile
*/
exports.updateMyProfile = async (req, res) => {

  // Check whether logged-in user belongs to society type
  if (req.user.type !== "society") {

    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  // Extract profile data from request body
  const {
    full_name,
    mobile_country_code,
    mobile_number
  } = req.body;

  // Query to update society user profile
  const [result] = await pool.query(
    `UPDATE society_users
     SET full_name = ?, mobile_country_code = ?, mobile_number = ?
     WHERE id = ?`,
    [full_name, mobile_country_code, mobile_number, req.user.id],
  );

  // Check whether update was successful
  if (!result.affectedRows) {

    return res.status(400).json({
      success: false,
      message: "Update failed"
    });
  }

  // Send success response
  res.json({
    success: true,
    message: "Profile updated successfully"
  });
};