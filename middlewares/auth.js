const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "You need to send a token to access this" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    res.status(401).json({ err: "Token not valid or expired" });
  }
};

exports.authAdmin = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "You need to send a token to access this" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodeToken.role.toUpperCase() !== "ADMIN") {
      return res.status(403).json({ err: "You must be an admin to access this" });
    }
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    res.status(401).json({ err: "Token not valid or expired" });
  }
};
