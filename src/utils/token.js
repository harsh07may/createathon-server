const jwt = require("jsonwebtoken");
const createAccessToken = (userId, userName, userRole) => {
  return jwt.sign(
    { userId: userId, userName: userName, userRole: userRole },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};
const createRefreshToken = (userId, userName, userRole) => {
  return jwt.sign(
    { userId: userId, userName: userName, userRole: userRole },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
module.exports = { createAccessToken, createRefreshToken };
