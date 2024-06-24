const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.JWT_SECRET_KEY

const middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET_KEY, (err, user) => {
        // if (err) {
        //     console.log(err);
        //   return res.sendStatus(403);
        // }
        console.log("user", user);
        req.user = user; // Create a global variable with user info
    });
} 
    next();
}

module.exports = {middleware}