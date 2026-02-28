const db = require("../config/database");

class ServiceRequest {
    static async create(data, userId) {
        // Generate ID like req01
        const [rows] = await db.query(
            "SELECT COUNT(*) as count FROM service_requests",
        );

        const newNumber = rows[0].count + 1;

        const newId = `req${newNumber}`;
        const requestNo = `SR-${newNumber}`;

        console.log("Generated ID:", newId);
        console.log("Generated Request No:", requestNo);

        const [result] = await db.query(
            `INSERT INTO service_requests
            (id, request_no, status_id, priority_id, trigger_id,
             category_id, subcategory_id,
             approximate_value_id, summary, description,
             society_id, created_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newId,                  
                requestNo,
                data.status_id,
                data.priority_id,
                data.trigger_id,
                data.category_id,
                data.subcategory_id,
                data.approximate_value_id,
                data.summary,
                data.description,
                data.society_id,
                userId,
            ],
        );

        return newId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM service_requests WHERE id = ?",
            [id],
        );

        return rows[0];
    }

    static async update(id, data, userId, connection) {
        const query = `
        UPDATE service_requests
        SET status_id = ?,
            priority_id = ?,
            trigger_id = ?,
            category_id = ?,
            subcategory_id = ?,
            approximate_value_id = ?,
            summary = ?,
            description = ?,
            updated_by_user_id = ?
        WHERE id = ?`;

        const params = [
            data.status_id,
            data.priority_id,
            data.trigger_id,
            data.category_id,
            data.subcategory_id,
            data.approximate_value_id,
            data.summary,
            data.description,
            userId,
            id,
        ];

        await connection.query(query, params);
    }

    static async getAll() {
        const [rows] = await db.query(
            "SELECT * FROM service_requests ORDER BY created_at DESC",
        );
        return rows;
    }
}

module.exports = ServiceRequest;
