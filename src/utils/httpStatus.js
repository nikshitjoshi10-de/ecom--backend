module.exports = {
  // ---- 2xx : Sab theek ----
  OK: 200,           // GET / PATCH / DELETE safal
  CREATED: 201,      // POST safal — nayi cheez ban gayi

  // ---- 4xx : Client (user) ki galti ----
  BAD_REQUEST: 400,  // Validation fail, galat input
  UNAUTHORIZED: 401, // Token nahi hai / galat hai / expire ho gaya
  FORBIDDEN: 403,    // Token sahi hai PAR permission nahi
  NOT_FOUND: 404,    // Product/route exist hi nahi karta
  CONFLICT: 409,     // Duplicate — jaise SKU pehle se hai

  // ---- 5xx : Server (humari) ki galti ----
  INTERNAL_SERVER_ERROR: 500,
};
