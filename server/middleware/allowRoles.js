// Middleware function to allow only specific user roles
function allowRoles(...allowedRoles) {

    // Return middleware function
    return (req, res, next) => {

        // Check if user or user role is missing
        if (!req.user || !req.user.systemRole) {

            console.error(
                "ROLE CHECK FAIL — no user role",
                req.originalUrl
            );

            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        // Check if user's role is not included in allowed roles
        if (!allowedRoles.includes(req.user.systemRole)) {

            console.error(
                "ROLE BLOCKED:",
                req.user.systemRole,
                "tried →",
                req.originalUrl
            );

            return res.status(403).json({
                message: "Unauthorized access",
            });
        }

        // Continue to next middleware or route handler
        next();
    };
};

module.exports = allowRoles;