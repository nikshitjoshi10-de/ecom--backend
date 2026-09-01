
const sameId = (a, b) => String(a) === String(b);

/**
 * ABAC - the fine question: "is it THIS record, and is it the right moment?"
 *
 * Every rule is a plain function of three kinds of attribute:
 *   SUBJECT      who is asking      -> actor.role, actor._id
 *   RESOURCE     what is touched    -> target.seller, target.user, target.status
 *   ENVIRONMENT  when               -> Date.now() vs target.deliveredAt
 *
 * A rule returns `true`, or a STRING explaining the refusal.
 *
 * NOTE (Day 9): rules now receive `req` as a third argument. Most ignore it,
 * but a rule about ONE ITEM inside an order needs the item id from the URL.
 */
 const POLICIES = {
  User: {
    read: (actor, target) =>
      actor.role === 'admin' ||
      sameId(actor._id, target._id) ||
      'This profile is not yours',

    manage: (actor, target) => {
      if (sameId(actor._id, target._id)) return 'You cannot block or delete your own account';
      if (target.role === 'admin') return 'An admin account cannot be modified from here';
      return true;
    },
  },

  Product: {
    update: (actor, product) =>
      actor.role === 'admin' ||
      sameId(product.seller, actor._id) ||
      'You can only edit your own products',

    delete: (actor, product) =>
      actor.role === 'admin' ||
      sameId(product.seller, actor._id) ||
      'You can only remove your own products',
  },

  Order: {
    read: (actor, order) =>
      actor.role === 'admin' ||
      sameId(order.user, actor._id) ||
      (actor.role === 'seller' && order.items.some((item) => sameId(item.seller, actor._id))) ||
      'This order is not yours',

    cancel: (actor, order) =>
      actor.role === 'admin' ||
      sameId(order.user, actor._id) ||
      'This order is not yours',

    fulfil: (actor, order) =>
      actor.role === 'admin' ||
      order.items.some((item) => sameId(item.seller, actor._id)) ||
      'None of the items in this order are yours',

    /* ── THE rule the whole policy layer was built for ─────────────────
       It is the only one in the project that needs all THREE attribute
       types at once, and it is impossible to express in RBAC. Read the
       four checks below out loud in class.                            */
    createReturn: (actor, order, req) => {
      // SUBJECT: is this your order?
      if (!sameId(order.user, actor._id)) return 'This order is not yours';

      const item = order.items.id(req.params.itemId);
      if (!item) return 'That item is not in this order';

      // RESOURCE: is the item in a state that can be returned?
      if (item.status !== 'delivered') return 'Only a delivered item can be returned';
      if (item.returnRequested) return 'A return has already been raised for this item';
      if (!item.deliveredAt) return 'This item has no delivery date yet';

      // ENVIRONMENT: is it still the right MOMENT? This is the attribute that
      // RBAC simply cannot see - a role does not change when a clock ticks.
      const elapsed = Date.now() - new Date(item.deliveredAt).getTime();
      if (elapsed > RETURN_WINDOW_MS) {
        return 'The 2-day return window for this item has closed';
      }

      return true;
    },
  },

  Return: {
    read: (actor, ret) =>
      actor.role === 'admin' ||
      sameId(ret.user, actor._id) ||
      sameId(ret.seller, actor._id) ||
      'This return is not yours',

    // Only the seller of the returned product may move it forward.
    manage: (actor, ret) =>
      actor.role === 'admin' ||
      sameId(ret.seller, actor._id) ||
      'This return is for another seller\'s product',
  },
};

 const policy = (action, model) => (req, _res, next) => {
  const rule = POLICIES[model]?.[action];
  if (!rule) throw apiError(500, `No policy defined for ${model}.${action}`);

  // loadResource must have run before this middleware.
  if (!req.resource) throw apiError(500, `policy('${action}','${model}') ran without loadResource`);

  const verdict = rule(req.user, req.resource, req);
  if (verdict !== true) {
    throw apiError(403, typeof verdict === 'string' ? verdict : 'Forbidden');
  }

  next();
};


module.exports ={policy,POLICIES}