const db = require("../config/database");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceRequestLog = require("../models/ServiceRequestLog");

class ServiceRequestController {

    // ===============================
    // CREATE REQUEST
    // ===============================
    static async createRequest(req, res) {
        try {
            const data = req.body;
    
            const newId = await ServiceRequest.create(
                data,
                req.user.id  // from auth middleware
            );
    
            res.status(201).json({
                message: "Service request created successfully",
                id: newId
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
            // make sure auth middleware sets req.user

            // 3️⃣ Insert snapshot into logs
            await ServiceRequestLog.create(oldData, connection);

            // 4️⃣ Update main table
            await ServiceRequest.update(id, newData, connection);

            await connection.commit();

            res.json({ message: "Service request updated successfully" });

        } catch (error) {
            await connection.rollback();
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
