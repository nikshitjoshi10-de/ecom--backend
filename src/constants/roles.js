const ROLES = { USER: 'user', SELLER: 'seller', ADMIN: 'admin' };
const ROLE_LIST = Object.values(ROLES);
//	A	visitor	may	sign	up	as	a	customer	or	a	seller.	`admin`	is	seeded	only.
const SIGNUP_ROLES = [ROLES.USER, ROLES.SELLER];

module.exports = { ROLES, ROLE_LIST, SIGNUP_ROLES }