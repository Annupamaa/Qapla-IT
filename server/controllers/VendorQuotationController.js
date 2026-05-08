// Import database connection
const db = require("../config/database");

class VendorQuotationController {

    /*
      Controller to fetch quotations of logged-in vendor
    */
    static async getMyQuotations(req, res) {

        try {

            // Get logged-in user ID from request
            const userId = req.user.id;

            // Query to fetch vendor ID using vendor user ID
            const [vendorUser] = await db.query(
                `SELECT vendor_id FROM vendor_users WHERE id = ?`,
                [userId]
            );

            // Check if vendor exists
            if (!vendorUser.length) {

                return res.status(400).json({
                    message: "Vendor not found"
                });
            }

            // Extract vendor ID
            const vendorId = vendorUser[0].vendor_id;

            // Query to fetch quotations and related service requests
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

            // Send quotations data in response
            res.json(rows);

        } catch (error) {

            // Handle server errors
            console.error(error);

            res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = VendorQuotationController;