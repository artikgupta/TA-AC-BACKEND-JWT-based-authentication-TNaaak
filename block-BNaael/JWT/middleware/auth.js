
var jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    var token = req.headers.authorization;
    try {
      if (token) {
        var payload = await jwt.verify(token, 'secret');
        req.user = payload;
        next();
      } else {
        res.status(400).json({ error: 'Token requireds' });
      }
    } catch (error) {
      return error;
    }
  },
};