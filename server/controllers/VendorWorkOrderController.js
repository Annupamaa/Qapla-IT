const db = require("../config/database");

class VendorWorkOrderController {

    //  GET WORK ORDERS
    static async getWorkOrders(req, res) {

        try {

            const userId = req.user.id;

            // get vendor_id
            const [vendorUser] = await db.query(
                `SELECT vendor_id FROM vendor_users WHERE id = ?`,
                [userId]
            );

            if (!vendorUser.length) {
                return res.status(400).json({ message: "Vendor user not found" });
            }

            const vendorId = vendorUser[0].vendor_id;

            const [rows] = await db.query(
                `
                SELECT 
                    wo.id,
                    wo.status,
                    wo.request_id,
                    wo.issued_at,
                    sr.request_no,
                    sr.summary
                FROM work_orders wo
                JOIN service_requests sr ON wo.request_id = sr.id
                WHERE wo.vendor_id = ?
                ORDER BY wo.issued_at DESC
                `,
                [vendorId]
            );

            res.json(rows);

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: error.message });

        }
    }

    //  MARK COMPLETED
    static async markCompleted(req, res) {

        try {

            const { work_order_id } = req.body;

            // update work order
            await db.query(
                `
                UPDATE work_orders
                SET status = 'COMPLETED',
                    completed_at = NOW()
                WHERE id = ?
                `,
                [work_order_id]
            );

            // update request
            await db.query(
                `
                UPDATE service_requests
                SET status_id = 'WOC'
                WHERE id = (
                    SELECT request_id FROM work_orders WHERE id = ?
                )
                `,
                [work_order_id]
            );

            res.json({ message: "Work marked as completed" });

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: error.message });

        }
    }
}

module.exports = VendorWorkOrderController;