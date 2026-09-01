const ROLES = require("./roles")

/**
 * RBAC - the coarse question: "does this ROLE have this permission AT ALL?"
 *
 * It is a static map. No database lookup, no I/O, no async.
 * The `:own` / `:any` suffix is the scope:
 *    product:update:own  -> a seller may update products they own
 *    product:update:any  -> an admin may update anybody's products
 *
 * The suffix does NOT enforce ownership by itself - it only records intent.
 * Actually checking "is this YOUR record" is ABAC's job (policy.js).
 */
 const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'user:read:any', 'user:manage:any',
    'product:read', 'product:create', 'product:update:any', 'product:delete:any',
    'category:manage', 'brand:manage', 'banner:manage',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own', 'order:read:any',
    'return:create:own', 'return:manage:any',
    'dashboard:admin',
  ],

  [ROLES.SELLER]: [
    'user:read:own', 'user:manage:own',
    'product:read', 'product:create', 'product:update:own', 'product:delete:own',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own',
    'return:create:own', 'return:manage:own',
    'dashboard:seller',
  ],

  [ROLES.USER]: [
    'user:read:own', 'user:manage:own',
    'product:read',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own',
    'return:create:own',
  ],
};

 const hasPermission = (role, required) => {
  const granted = PERMISSIONS[role] ?? [];
  return (
    granted.includes(required) ||
    granted.includes(`${required}:own`) ||
    granted.includes(`${required}:any`)
  );
};

hasPermission ("user","cart:manage:own")
[ROLES.USER]== "user"
PERMISSIONS.user=  [
    'user:read:own', 'user:manage:own',
    'product:read',
    'cart:manage:own', 'wishlist:manage:own',
    'order:create', 'order:read:own',
    'return:create:own',
  ]
module.exports = {PERMISSIONS,hasPermission}