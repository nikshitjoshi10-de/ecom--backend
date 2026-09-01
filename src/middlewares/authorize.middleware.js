const { hasPermission } = require("../constants/permissions");

const authorize = (...required) => (req, _res, next) => {
    if (!req.user) throw apiError(401, 'Please login to continue');

    const allowed = required.every((permission) => hasPermission(req.user.role, permission));
    if (!allowed) throw apiError(403, 'You do not have permission to perform this action');

    next();
};

/**
 * Blunt instrument for routes that are simply "admins only" or "sellers only",
 * where inventing a permission name would add nothing.
 */
const allowRoles = (...roles) => (req, _res, next) => {
    if (!req.user) throw apiError(401, 'Please login to continue');
    if (!roles.includes(req.user.role)) throw apiError(403, 'Forbidden for your role');
    next();
};

module.exports = { authorize, allowRoles };
