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
    sr.summary,
    sr.status_id AS request_status
FROM work_orders wo
JOIN service_requests sr ON wo.request_id = sr.id
WHERE wo.vendor_id = ?
ORDER BY wo.issued_at DESC;
                `,
                [vendorId]
            );

            res.json(rows);

        } catch (error) {
            console.error("GET WORK ORDERS ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    }

    //  MARK COMPLETED
    static async markCompleted(req, res) {
        try {
            const { work_order_id } = req.body;
            const userId = req.user.id;

            //  Get request_id from work_orders
            const [workOrders] = await db.query(
                `SELECT request_id FROM work_orders WHERE id = ?`,
                [work_order_id]
            );

            if (!workOrders.length) {
                return res.status(404).json({ message: "Work order not found" });
            }

            const requestId = workOrders[0].request_id.toString();

            //  Update work_orders table
            await db.query(
                `
                UPDATE work_orders
                SET status = 'COMPLETED'
                WHERE id = ?
                `,
                [work_order_id]
            );

            //  Update service_requests table
            await db.query(
                `
                UPDATE service_requests
                SET status_id = 'WOC',   
                    updated_at = NOW()
                WHERE id = ?
                `,
                [requestId]
            );

            res.json({ message: "Work order marked as completed successfully" });

        } catch (error) {
            console.error("MARK COMPLETED ERROR:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = VendorWorkOrderController;