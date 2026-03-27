const db = require("../config/database");

class VendorRequestResponse {

    static async markSent(data) {

        const query = `
INSERT INTO vendor_request_responses
(request_id, vendor_id, quotation_sent, sent_method)
VALUES (?, ?, ?, ?)
`;

        await db.query(query, [
            data.request_id,
            data.vendor_id,
            true,
            data.sent_method
        ]);

    }

}

module.exports = VendorRequestResponse;