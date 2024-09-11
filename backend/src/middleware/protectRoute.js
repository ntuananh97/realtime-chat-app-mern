const { TOKEN_NAME, CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const User = require("../models/UserModel");
const { returnInternalErrorResponse } = require("../utils/returnResponse");
const jwt = require("jsonwebtoken");
const process = require("process");

const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookie and check if it exists
    const token = req.cookies[TOKEN_NAME];

    if (!token) {
      return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
        message: "Unauthorized - No Token Provided",
        typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) { // If token is invalid
      return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
        message: "Unauthorized - Invalid Token",
        typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
      });
    }

    // Check user in database
    const user = await User.findById(decoded.userId).select("-password");
    console.log("protectRoute ~ user:", user)

    // Check if user is authenticated
    if (!user) {
      return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
        message: "Unauthorized - User not found",
        typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
      });
    }

    // Add user object to req
    req.user = user
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    return returnInternalErrorResponse(res);
  }
};

module.exports = protectRoute;
