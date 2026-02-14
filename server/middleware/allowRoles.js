function allowRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.systemRole) {
            console.error("ROLE CHECK FAIL — no user role", req.originalUrl);
            return res.status(403).json({ message: "Unauthorized" });
        }

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

        next();
    };
};

module.exports = allowRoles;