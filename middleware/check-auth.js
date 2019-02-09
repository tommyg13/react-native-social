const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split` `[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        // pass decoded data to the requests
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({error:"You have to log in"});
    }
};