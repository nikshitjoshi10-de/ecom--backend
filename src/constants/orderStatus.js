// Per ITEM, because a single order can hold products from several sellers and
// each seller ships on their own schedule.
 const ITEM_STATUS = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

// Per ORDER: derived from the items, never set by hand.
 const ORDER_STATUS = ['pending_payment', 'confirmed', 'completed', 'cancelled'];

 const PAYMENT_METHODS = ['cod', 'razorpay'];
 const PAYMENT_STATUS = ['pending', 'paid', 'failed'];

/**
 * A seller may only move an item FORWARD, and only one step at a time.
 * A lookup table beats an if/else ladder: adding a step is one line.
 */

 const ALLOWED_ITEM_TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],      // only a Return can move it from here (Day 9)
  cancelled: [],
  returned: [],
};

// A shopper may cancel while nothing has shipped.
 const CANCELLABLE_ITEM_STATUS = ['placed', 'confirmed'];

// The 2-day return window, in one place so nobody re-types the arithmetic.
 const RETURN_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

 module.exports={RETURN_WINDOW_MS,CANCELLABLE_ITEM_STATUS,ALLOWED_ITEM_TRANSITIONS,PAYMENT_STATUS,PAYMENT_METHODS,ORDER_STATUS,ITEM_STATUS}