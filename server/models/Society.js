const db = require('../config/database');

class Society {
  // Get all societies
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM societies ORDER BY created_at DESC');
    return rows;
  }

  // Get society by ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM societies WHERE id = ?', [id]);
    return rows[0];
  }

  // Create society
  static async create(societyData) {
    const {
      legal_name, short_name, registration_number, registration_date,
      registering_authority, society_type, project_name,
      registered_address_line1, registered_address_line2, city, state, pincode,
      pan, gstin, tan, risk_tier, num_flats_units, num_towers_wings,
      annual_maintenance_budget_amount, payment_mode_preference,
      tender_threshold_amount, min_quotations_below_threshold,
      emergency_approval_rules_json, status
    } = societyData;

    const [result] = await db.execute(
      `INSERT INTO societies (
        legal_name, short_name, registration_number, registration_date,
        registering_authority, society_type, project_name,
        registered_address_line1, registered_address_line2, city, state, pincode,
        pan, gstin, tan, risk_tier, num_flats_units, num_towers_wings,
        annual_maintenance_budget_amount, payment_mode_preference,
        tender_threshold_amount, min_quotations_below_threshold,
        emergency_approval_rules_json, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        legal_name, short_name, registration_number, registration_date,
        registering_authority, society_type, project_name,
        registered_address_line1, registered_address_line2, city, state, pincode,
        pan, gstin, tan, risk_tier || 'TIER_C', num_flats_units, num_towers_wings,
        annual_maintenance_budget_amount, payment_mode_preference || 'RECORD_ONLY',
        tender_threshold_amount || 100000.00, min_quotations_below_threshold || 3,
        emergency_approval_rules_json ? JSON.stringify(emergency_approval_rules_json) : null,
        status || 'DRAFT'
      ]
    );
    return this.getById(result.insertId);
  }

  // Update society
  static async update(id, societyData) {
    const fields = [];
    const values = [];

    // Handle JSON fields
    if (societyData.emergency_approval_rules_json) {
      societyData.emergency_approval_rules_json = JSON.stringify(societyData.emergency_approval_rules_json);
    }

    Object.keys(societyData).forEach(key => {
      if (societyData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(societyData[key]);
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const query = `UPDATE societies SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(query, values);
    return this.getById(id);
  }

  static async countAll() {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM societies`);
    return rows[0].count;
  }

  // Delete society
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM societies WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Society;




