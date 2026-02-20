const db = require("../config/database");

class ServiceRequestLog {

    /**
     * Create log entry (snapshot before update)
     * @param {Object} oldData
     * @param {Object} connection (transaction connection)
     */
    static async create(oldData, connection) {
        const query = `
      INSERT INTO service_request_logs
      (
        service_request_id,
        status_id,
        priority_id,
        trigger_id,
        category_id,
        subcategory_id,
        approximate_value_id,
        summary,
        description,
        action_by_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            oldData.id,
            oldData.status_id,
            oldData.priority_id,
            oldData.trigger_id,
            oldData.category_id,
            oldData.subcategory_id,
            oldData.approximate_value_id,
            oldData.summary,
            oldData.description,
            oldData.action_by_user_id   // This should come from req.user.id
        ];

        return await connection.query(query, values);
    }


    /**
     * Get all logs for a specific request
     */
    static async getByRequestId(serviceRequestId) {
        const [rows] = await db.query(
            `
      SELECT *
      FROM service_request_logs
      WHERE service_request_id = ?
      ORDER BY created_at DESC
      `,
            [serviceRequestId]
        );

        return rows;
    }


    /**
     * (Optional) Delete logs by request ID
     * Useful if request is permanently deleted
     */
    static async deleteByRequestId(serviceRequestId) {
        return await db.query(
            "DELETE FROM service_request_logs WHERE service_request_id = ?",
            [serviceRequestId]
        );
    }

}

module.exports = ServiceRequestLog;
