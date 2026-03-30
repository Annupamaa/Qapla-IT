const db = require("../config/database");

class VendorResponseController {

    static async markQuotationSent(req, res) {

        try {
    
            const vendorId = req.user.id;
            const { request_id, sent_method } = req.body;
    
            //Save vendor quotation response
            await db.query(
            `
            INSERT INTO vendor_request_responses
            (request_id, vendor_id, quotation_sent, sent_method, status)
            VALUES (?, ?, 1, ?, 'quotation_sent')
            `,
            [request_id, vendorId, sent_method]
            );
    
            // Update service request status → QUOTATIONS_RECEIVED
            await db.query(
            `
            UPDATE service_requests
            SET status_id = 'QUR',
                updated_at = NOW()
            WHERE id = ?
            `,
            [request_id]
            );
    
            res.json({ message: "Quotation saved and request updated" });
    
        } catch (error) {
    
            console.error(error);
            res.status(500).json({ error: error.message });
    
        }
    
    }

}

module.exports = VendorResponseController;