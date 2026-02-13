const db = require('../config/database');

class Vendor {
  // Get all vendors
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM vendors ORDER BY created_at DESC');
    return rows;
  }

  // Get vendor by ID
  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM vendors WHERE id = ?', [id]);
    return rows[0];
  }

  // Create vendor
  static async create(vendorData) {

    const sanitize = v => (v === undefined ? null : v);

    const {
      legal_name, trade_name, entity_type, pan, gstin, msme_udyam_number,
      cin_llpin, shop_establishment_number, registered_address_line1,
      registered_address_line2, city, state, pincode, service_coverage_desc,
      primary_contact_name, primary_contact_phone, primary_contact_email,
      secondary_contact_name, secondary_contact_phone, secondary_contact_email,
      operating_hours_text, emergency_contact_name, emergency_contact_phone,
      bank_account_name, bank_account_number, bank_ifsc, risk_tier,
      preferred_job_min_value, preferred_job_max_value, max_concurrent_jobs,
      emergency_response_time_minutes, warranty_offered, amc_offered,
      average_rating, status
    } = vendorData;

    const values = [
      legal_name, trade_name, entity_type, pan, gstin, msme_udyam_number,
      cin_llpin, shop_establishment_number, registered_address_line1,
      registered_address_line2, city, state, pincode, service_coverage_desc,
      primary_contact_name, primary_contact_phone, primary_contact_email,
      secondary_contact_name, secondary_contact_phone, secondary_contact_email,
      operating_hours_text, emergency_contact_name, emergency_contact_phone,
      bank_account_name, bank_account_number, bank_ifsc, risk_tier,
      preferred_job_min_value, preferred_job_max_value, max_concurrent_jobs,
      emergency_response_time_minutes, warranty_offered, amc_offered,
      average_rating, status || 'DRAFT'
    ].map(sanitize);

    const [result] = await db.execute(
      `INSERT INTO vendors (
        legal_name, trade_name, entity_type, pan, gstin, msme_udyam_number,
        cin_llpin, shop_establishment_number, registered_address_line1,
        registered_address_line2, city, state, pincode, service_coverage_desc,
        primary_contact_name, primary_contact_phone, primary_contact_email,
        secondary_contact_name, secondary_contact_phone, secondary_contact_email,
        operating_hours_text, emergency_contact_name, emergency_contact_phone,
        bank_account_name, bank_account_number, bank_ifsc, risk_tier,
        preferred_job_min_value, preferred_job_max_value, max_concurrent_jobs,
        emergency_response_time_minutes, warranty_offered, amc_offered,
        average_rating, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );
    return this.getById(result.insertId);
  }

  // Update vendor
  static async update(id, vendorData) {
    const fields = [];
    const values = [];
  
    const blocked = ['id', 'created_at', 'updated_at'];
  
    Object.keys(vendorData).forEach(key => {
      if (
        vendorData[key] !== undefined &&
        !blocked.includes(key)
      ) {
        fields.push(`${key} = ?`);
        values.push(vendorData[key]);
      }
    });
  
    if (fields.length === 0) {
      return this.getById(id);
    }
  
    // force server-side updated_at
    fields.push('updated_at = NOW()');
  
    values.push(id);
  
    const query = `UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(query, values);
  
    return this.getById(id);
  }

  static async countAll() {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM vendors`);
    return rows[0].count;
  }

  // Delete vendor
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM vendors WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Vendor;




