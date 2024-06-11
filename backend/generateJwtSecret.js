
const crypto = require('crypto');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');


console.log(jwtSecret);