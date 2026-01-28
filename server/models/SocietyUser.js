const db = require('../config/database');
const bcrypt = require('bcryptjs');

class SocietyUser {
  // Get all society users
  static async getAll(societyId = null) {
    let query = 'SELECT su.*, s.legal_name as society_name FROM society_users su LEFT JOIN societies s ON su.society_id = s.id';
    const params = [];
    
    if (societyId) {
      query += ' WHERE su.society_id = ?';
      params.push(societyId);
    }
    
    query += ' ORDER BY su.created_at DESC';
    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Get society user by ID
  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT su.*, s.legal_name as society_name FROM society_users su LEFT JOIN societies s ON su.society_id = s.id WHERE su.id = ?',
      [id]
    );
    return rows[0];
  }

  // Create society user
  static async create(userData) {
    const {
      society_id, email, mobile_country_code, mobile_number, password,
      full_name, role, term_start_date, term_end_date,
      is_authorized_signatory, approval_limit_amount, is_active
    } = userData;

    // Hash password
    const password_hash = await bcrypt.hash(password || 'defaultPassword123', 10);

    const [result] = await db.execute(
      `INSERT INTO society_users (
        society_id, email, mobile_country_code, mobile_number, password_hash,
        full_name, role, term_start_date, term_end_date,
        is_authorized_signatory, approval_limit_amount, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        society_id, email, mobile_country_code, mobile_number, password_hash,
        full_name, role, term_start_date, term_end_date,
        is_authorized_signatory ?? false, approval_limit_amount, is_active ?? true
      ]
    );
    return this.getById(result.insertId);
  }

  // Update society user
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
    const query = `UPDATE society_users SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(query, values);
    return this.getById(id);
  }

  // Delete society user
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM society_users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = SocietyUser;




