const jwt  = require("jsonwebtoken"),
      User = require("../models/User");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: "Invalid token" } });
      } else {
        User.findOne({ email: decoded.email }).then(user => {
          req.user = user.email;
          next();
        });
      }
    });
  } else {
    res.status(401).json({ error: 'unauthorize'});
  }
};