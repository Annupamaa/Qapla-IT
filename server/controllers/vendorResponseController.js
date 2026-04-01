const db = require("../config/database");

class VendorResponseController {

    static async markQuotationSent(req, res) {

        try {
    
            const userId = req.user.id;
            const { request_id, sent_method } = req.body;
    
            // GET vendor_id
            const [vendorUser] = await db.query(
                `SELECT vendor_id FROM vendor_users WHERE id = ?`,
                [userId]
            );
    
            if (!vendorUser.length) {
                return res.status(400).json({ message: "Vendor user not found" });
            }
    
            const vendorId = vendorUser[0].vendor_id;
    
            // CHECK duplicate
            const [existing] = await db.query(
                `SELECT id FROM quotations 
                 WHERE req_id = ? AND vendor_id = ?`,
                [request_id, vendorId]
            );
    
            if (existing.length > 0) {
                return res.status(400).json({ message: "Quotation already submitted" });
            }
    
            //  INSERT INTO CORRECT TABLE ✅
            await db.query(
                `
                INSERT INTO quotations
                (req_id, vendor_id, vendor_user_id, quo_sent_method, quo_send_date, status)
                VALUES (?, ?, ?, ?, NOW(), 'SENT')
                `,
                [
                    request_id,
                    vendorId,
                    userId,
                    sent_method
                ]
            );
    
            // UPDATE STATUS
            await db.query(
                `
                UPDATE service_requests
                SET status_id = 'QUR',
                    updated_at = NOW()
                WHERE id = ?
                `,
                [request_id]
            );
    
            res.json({ message: "Quotation saved successfully" });
    
        } catch (error) {
    
            console.error(error);
            res.status(500).json({ error: error.message });
    
        }
    }

}

module.exports = VendorResponseController;