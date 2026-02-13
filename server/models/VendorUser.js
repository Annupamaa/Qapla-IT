const db = require('../config/database');
const bcrypt = require('bcryptjs');

class VendorUser {
  // Get all vendor users
  static async getAll(vendorId = null) {
    let query = 'SELECT vu.*, v.legal_name as vendor_name FROM vendor_users vu LEFT JOIN vendors v ON vu.vendor_id = v.id';
    const params = [];
    
    if (vendorId) {
      query += ' WHERE vu.vendor_id = ?';
      params.push(vendorId);
    }
    
    query += ' ORDER BY vu.created_at DESC';
    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Get vendor user by ID
  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT vu.*, v.legal_name as vendor_name FROM vendor_users vu LEFT JOIN vendors v ON vu.vendor_id = v.id WHERE vu.id = ?',
      [id]
    );
    return rows[0];
  }

  // Create vendor user
  static async create(userData) {
    const {
      vendor_id, email, mobile_country_code, mobile_number, password,
      full_name, role, is_primary_contact, is_active
    } = userData;

    // Hash password
    const password_hash = await bcrypt.hash(password || 'defaultPassword123', 10);

    const [result] = await db.execute(
      `INSERT INTO vendor_users (
        vendor_id, email, mobile_country_code, mobile_number, password_hash,
        full_name, role, is_primary_contact, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendor_id, email, mobile_country_code, mobile_number, password_hash,
        full_name, role, is_primary_contact ?? false, is_active ?? true
      ]
    );
    return this.getById(result.insertId);
  }

  // Update vendor user
  static async update(id, userData) {
    const fields = [];
    const values = [];

    // Handle password hashing if password is being updated
    if (userData.password) {
      userData.password_hash = await bcrypt.hash(userData.password, 10);
      delete userData.password;
    }

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'password') {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const query = `UPDATE vendor_users SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(query, values);
    return this.getById(id);
  }

  static async countAll() {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM vendor_users`);
    return rows[0].count;
  }

  // Delete vendor user
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM vendor_users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = VendorUser;




