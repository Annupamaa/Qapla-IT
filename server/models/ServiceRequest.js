const db = require("../config/db");

class ServiceRequest {

    static async create(data) {
        const [result] = await db.query(
            `INSERT INTO service_requests
      (id, status_id, priority_id, trigger_id,
       category_id, subcategory_id,
       approximate_value_id, summary, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.status_id,
                data.priority_id,
                data.trigger_id,
                data.category_id,
                data.subcategory_id,
                data.approximate_value_id,
                data.summary,
                data.description
            ]
        );

        return result;
    }

    static async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM service_requests WHERE id = ?",
            [id]
        );

        return rows[0];
    }

    static async update(id, data, connection) {
        return await connection.query(
            `UPDATE service_requests SET
        status_id = ?,
        priority_id = ?,
        trigger_id = ?,
        category_id = ?,
        subcategory_id = ?,
        approximate_value_id = ?,
        summary = ?,
        description = ?
      WHERE id = ?`,
            [
                data.status_id,
                data.priority_id,
                data.trigger_id,
                data.category_id,
                data.subcategory_id,
                data.approximate_value_id,
                data.summary,
                data.description,
                id
            ]
        );
    }

    static async getAll() {
        const [rows] = await db.query(
            "SELECT * FROM service_requests ORDER BY created_at DESC"
        );
        return rows;
    }
}

module.exports = ServiceRequest;
