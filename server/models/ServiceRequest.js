const db = require("../config/database");

class ServiceRequest {
    static async create(data, userId) {

        const [rows] = await db.query(
            "SELECT COUNT(*) as count FROM service_requests"
        );

        const newNumber = rows[0].count + 1;
        const newId = newNumber.toString();
        const requestNo = `SR-${newNumber}`;

        // Convert IDs to codes
        const [[status]] = await db.query(
            "SELECT code FROM request_statuses WHERE id = ?",
            [data.status_id]
        );

        const [[priority]] = await db.query(
            "SELECT code FROM priorities WHERE id = ?",
            [data.priority_id]
        );

        const [[trigger]] = await db.query(
            "SELECT code FROM request_triggers WHERE id = ?",
            [data.trigger_id]
        );

        const [[category]] = await db.query(
            "SELECT code FROM request_categories WHERE id = ?",
            [data.category_id]
        );

        const [[subcategory]] = await db.query(
            "SELECT code FROM request_subcategories WHERE id = ?",
            [data.subcategory_id]
        );

        const [[approxValue]] = await db.query(
            "SELECT label FROM approximate_values WHERE id = ?",
            [data.approximate_value_id]
        );

        await db.query(
            `INSERT INTO service_requests
            (id, request_no, status_id, priority_id, trigger_id,
             category_id, subcategory_id,
             approximate_value_id, summary, description,
             society_id, created_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newId,
                requestNo,
                status.code,
                priority.code,
                trigger.code,
                category.code,
                subcategory.code,
                approxValue.label,
                data.summary,
                data.description,
                data.society_id,
                userId
            ]
        );

        return newId;
    }

    static async findById(id) {

        const query = `
            SELECT 
                sr.id,
                sr.request_no,
                sr.summary,
                sr.description,
    
                rc.label AS category,
                p.label AS priority,
                sr.approximate_value_id AS approx_value,
    
                s.legal_name AS society_name,
                su.full_name AS contact_person,
                su.mobile_number AS phone,
                su.email
    
            FROM service_requests sr
    
            LEFT JOIN request_categories rc 
                ON sr.category_id = rc.code
    
            LEFT JOIN priorities p
                ON sr.priority_id = p.code
    
            LEFT JOIN societies s
                ON sr.society_id = s.id
    
            LEFT JOIN society_users su
                ON sr.created_by_user_id = su.id
    
            WHERE sr.id = ?
        `;
    
        const [rows] = await db.query(query, [id]);
    
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

    static async updateStatus(id, statusCode, userId) {

        const query = `
            UPDATE service_requests
            SET status_id = ?, updated_by_user_id = ?
            WHERE id = ?
        `;

        await db.query(query, [statusCode, userId, id]);
    }

    static async getAll() {

        const [rows] = await db.query(
            "SELECT * FROM service_requests ORDER BY created_at DESC",
        );
        return rows;
    }

    static async getPublishedRequests(vendorId) {

        const query = `
            SELECT 
                sr.id,
                sr.request_no,
                sr.summary,
                sr.description,
                rc.label AS category,
                p.label AS priority,
                sr.approximate_value_id AS approx_value,
                sr.society_id,
                rs.label AS status,
    
                COALESCE(vr.status,'new') AS vendor_status
    
            FROM service_requests sr
    
            LEFT JOIN request_categories rc 
                ON sr.category_id = rc.code
    
            LEFT JOIN request_statuses rs 
                ON sr.status_id = rs.code
    
            LEFT JOIN priorities p
                ON sr.priority_id = p.code
    
            LEFT JOIN vendor_request_responses vr
                ON sr.id = vr.request_id 
                AND vr.vendor_id = ?
    
            WHERE sr.status_id = 'PUB'
    
            ORDER BY sr.created_at DESC
        `;
    
        const [rows] = await db.query(query, [vendorId]);
    
        return rows;
    }

    static async createResolution(request_id, resolution_number) {

        const query = `
            UPDATE service_requests
            SET resolution_number = ?,
                status_id = 'RSD'
            WHERE id = ?
        `;
    
        await db.query(query, [resolution_number, request_id]);
    }
    
    static async issueWorkOrder(request_id) {
    
        const query = `
            UPDATE service_requests
            SET status_id = 'WOI'
            WHERE id = ?
        `;
    
        await db.query(query, [request_id]);
    }
}

module.exports = ServiceRequest;
