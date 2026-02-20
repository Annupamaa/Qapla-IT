const db = require("../config/database");

class DropdownController {

    // Generic function to fetch dropdown values
    static async getDropdown(req, res) {
        const { type } = req.params;

        // Map allowed tables (Security purpose)
        const tableMap = {
            statuses: "request_statuses",
            priorities: "priorities",
            triggers: "request_triggers",
            categories: "request_categories",
            subcategories: "request_subcategories",
            approximate_values: "approximate_values"
        };

        const tableName = tableMap[type];

        if (!tableName) {
            return res.status(400).json({ message: "Invalid dropdown type" });
        }

        try {
            const [rows] = await db.query(
                `SELECT id, name FROM ${tableName} ORDER BY id ASC`
            );

            res.json(rows);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = DropdownController;
