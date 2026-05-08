// Import database connection
const db = require("../config/database");

class VendorRequestResponse {

    /*
      Function to mark quotation as sent by vendor
    */
    static async markSent(data) {

        // SQL query to insert vendor quotation response
        const query = `
INSERT INTO vendor_request_responses
(request_id, vendor_id, quotation_sent, sent_method)
VALUES (?, ?, ?, ?)
`;

        // Execute database query with provided data
        await db.query(query, [
            data.request_id,
            data.vendor_id,
            true,
            data.sent_method
        ]);

    }

}

module.exports = VendorRequestResponse;