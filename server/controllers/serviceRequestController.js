const db = require("../config/database");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceRequestLog = require("../models/ServiceRequestLog");

class ServiceRequestController {

    // INVOICE RECEIVED (Secretary)
    static async markInvoiceReceived(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "PAY", req.user.id);

            res.json({ message: "Invoice marked as received" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // PAYMENT DONE (Secretary)
    static async markPaymentDone(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "PAY", req.user.id);

            res.json({ message: "Payment marked as done" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // RECEIPT RECEIVED (Secretary)
    static async markReceiptReceived(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "REC", req.user.id);

            res.json({ message: "Receipt received" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // SEND INVOICE (Vendor)
    static async sendInvoice(req, res) {
        try {
            const { id } = req.params;
    
            await ServiceRequest.sendInvoice(id, req.user.id);
    
            res.json({ message: "Invoice sent successfully" });
        } catch (error) {
            console.error("SEND INVOICE ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    }

    // CLOSED (Secretary)
    static async closeRequest(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "COM", req.user.id);

            res.json({ message: "Request closed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

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
             rs.id as status_id,
             rs.code as status_code,
             rs.label as status,
             p.label as priority,
             su.full_name as created_by_name
      FROM service_requests sr
      JOIN request_statuses rs ON sr.status_id = rs.code
      JOIN priorities p ON sr.priority_id = p.code
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
                   rs.id as status_id,
                   rs.code as status_code,
                   rs.label as status,
                   p.label as priority,
                   su.full_name as created_by_name
            FROM service_requests sr
            JOIN request_statuses rs ON sr.status_id = rs.code
            JOIN priorities p ON sr.priority_id = p.code
            JOIN society_users su ON sr.created_by_user_id = su.id
            WHERE sr.created_by_user_id = ? 
            AND sr.society_id = ?
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
            const data = {
                ...req.body,
                society_id: req.user.societyId,
            };

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

            //Get existing record
            const oldData = await ServiceRequest.findById(id);

            if (!oldData) {
                return res.status(404).json({ message: "Request not found" });
            }

            //Attach user id for log
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

    static async approveRequest(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "APR", req.user.id);

            res.json({ message: "Request approved successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async cancelRequest(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "CAN", req.user.id);

            res.json({ message: "Request cancelled successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async publishRequest(req, res) {
        try {
            const { id } = req.params;

            await ServiceRequest.updateStatus(id, "PUB", req.user.id);

            res.json({ message: "Request published to vendors" });
        } catch (error) {
            res.status(500).json({ error: error.message });
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

    static async getPublishedRequests(req, res) {
        try {
            const userId = req.user.id;

            //  GET vendor_id from vendor_users
            const [vendorUser] = await db.query(
                `SELECT vendor_id FROM vendor_users WHERE id = ?`,
                [userId],
            );

            if (!vendorUser.length) {
                return res.status(400).json({ message: "Vendor user not found" });
            }

            const vendorId = vendorUser[0].vendor_id;

            const requests = await ServiceRequest.getPublishedRequests(vendorId);

            res.json(requests);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async createResolution(req, res) {
        try {
            const { request_id, resolution_number } = req.body;
            const userId = req.user.id;

            //Insert into resolution table
            await db.query(
                `
            INSERT INTO service_request_resolutions
            (request_id, resolution_number, created_by)
            VALUES (?, ?, ?)
            `,
                [request_id, resolution_number, userId],
            );

            // Update main request
            await ServiceRequest.createResolution(request_id, resolution_number);

            res.json({
                message: "Resolution created successfully",
            });
        } catch (error) {
            console.error("CREATE RESOLUTION ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async issueWorkOrder(req, res) {
        try {
            const { request_id } = req.body;

            await ServiceRequest.issueWorkOrder(request_id, req.user.id);

            res.json({
                message: "Work order issued",
            });
        } catch (error) {
            console.error("WORK ORDER ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ServiceRequestController;
