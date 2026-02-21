const db = require("../config/database");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceRequestLog = require("../models/ServiceRequestLog");

class ServiceRequestController {
    // ===============================
    // GET REQUESTS BY SOCIETY
    // ===============================
    static async getRequestsBySociety(req, res) {
        try {
            const societyIdFromToken = req.user.societyId;

            if (!societyIdFromToken) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const query = `
    SELECT sr.id,
           sr.request_no,
           sr.summary,
           rs.label as status,
           p.label as priority,
           su.full_name as created_by_name
    FROM service_requests sr
    JOIN request_statuses rs ON sr.status_id = rs.id
    JOIN priorities p ON sr.priority_id = p.id
    JOIN society_users su ON sr.created_by_user_id = su.id
    WHERE sr.society_id = ?
    ORDER BY sr.created_at DESC
`;

            const [rows] = await db.query(query, [societyIdFromToken]);

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===============================
    // GET REQUESTS CREATED BY LOGGED-IN USER
    // ===============================
    static async getMyRequests(req, res) {
        try {
            const userId = req.user.id; // from auth middleware
            const societyId = req.user.societyId;

            if (!userId || !societyId) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const query = `
            SELECT sr.id,
                   sr.request_no,
                   sr.summary,
                   rs.label as status,
                   p.label as priority,
                   su.full_name as created_by_name
            FROM service_requests sr
            JOIN request_statuses rs ON sr.status_id = rs.id
            JOIN priorities p ON sr.priority_id = p.id
            JOIN society_users su ON sr.created_by_user_id = su.id
            WHERE sr.created_by_user_id = ? AND sr.society_id = ?
            ORDER BY sr.created_at DESC
        `;

            const [rows] = await db.query(query, [userId, societyId]);

            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===============================
    // CREATE REQUEST
    // ===============================
    static async createRequest(req, res) {
        try {
            const data = req.body;

            const newId = await ServiceRequest.create(
                data,
                req.user.id, // from auth middleware
            );

            res.status(201).json({
                message: "Service request created successfully",
                id: newId,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===============================
    // UPDATE REQUEST (WITH LOGGING)
    // ===============================
    static async updateRequest(req, res) {
        const { id } = req.params;
        const newData = req.body;

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1️⃣ Get existing record
            const oldData = await ServiceRequest.findById(id);

            if (!oldData) {
                return res.status(404).json({ message: "Request not found" });
            }

            // 2️⃣ Attach user id for log
            oldData.action_by_user_id = req.user.id;

            await ServiceRequestLog.create(oldData, connection);

            await ServiceRequest.update(id, newData, req.user.id, connection);

            await connection.commit();

            res.json({ message: "Service request updated successfully" });
        } catch (error) {
            await connection.rollback();
            console.error("UPDATE REQUEST ERROR:", error);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    }

    // ===============================
    // GET ALL REQUESTS
    // ===============================
    static async getAllRequests(req, res) {
        try {
            const requests = await ServiceRequest.getAll();
            res.json(requests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===============================
    // GET SINGLE REQUEST
    // ===============================
    static async getRequestById(req, res) {
        try {
            const { id } = req.params;

            const request = await ServiceRequest.findById(id);

            if (!request) {
                return res.status(404).json({ message: "Request not found" });
            }

            res.json(request);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ===============================
    // GET REQUEST HISTORY
    // ===============================
    static async getRequestHistory(req, res) {
        try {
            const { id } = req.params;

            const logs = await ServiceRequestLog.getByRequestId(id);

            res.json(logs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ServiceRequestController;
