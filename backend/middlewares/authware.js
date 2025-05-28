// authMiddleware.js
const isAuthenticated = (req, res, next) => {
    const { userInfo } = req.cookies;
    console.log('Received userInfo cookie:', userInfo); // Debug log
    if (userInfo) {
      try {
        // Parse the cookie and attach the user info to the request
        req.user = JSON.parse(decodeURIComponent(userInfo));
        return next();
      } catch (error) {
        return res.status(401).json({ error: "Invalid authentication token" });
      }
    }
    return res.status(401).json({ error: "User not authenticated" });
  };
  
  module.exports = { isAuthenticated };
  