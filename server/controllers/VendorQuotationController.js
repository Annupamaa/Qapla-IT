const db = require("../config/database");

class VendorQuotationController {

    static async getMyQuotations(req, res) {
        try {

            const userId = req.user.id;

            const [vendorUser] = await db.query(
                `SELECT vendor_id FROM vendor_users WHERE id = ?`,
                [userId]
            );

            if (!vendorUser.length) {
                return res.status(400).json({ message: "Vendor not found" });
            }

            const vendorId = vendorUser[0].vendor_id;

            const [rows] = await db.query(
                `
                SELECT 
                    q.id AS quotation_id,
                    q.status AS quotation_status,
                    q.quo_send_date,
                    sr.id AS request_id,
                    sr.request_no,
                    sr.summary,
                    sr.status_id AS request_status
                FROM quotations q
                JOIN service_requests sr ON q.req_id = sr.id
                WHERE q.vendor_id = ?
                ORDER BY q.quo_send_date DESC
                `,
                [vendorId]
            );

            res.json(rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = VendorQuotationController;