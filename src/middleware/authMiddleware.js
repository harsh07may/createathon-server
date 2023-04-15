const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    return res.status(401).send("You are not logged in");
  }

  const token = authorization.replace("Bearer ", "");
  const userData = jwt.verify(token, process.env.TOKEN_SECRET);

  req.user = userData;
  next();
};

module.exports = authMiddleware;
