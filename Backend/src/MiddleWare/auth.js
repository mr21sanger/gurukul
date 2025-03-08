const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (token) {
        try {
            const userData = jwt.verify(token, SECRET_KEY);
            req.user = userData;
            next();
        } catch (error) {
            return res.status(401).send({ error: "Invalid Token" });
        }
    } else {
        return res.status(401).send({ error: "Token is not provided" });
    }
};

module.exports = verifyToken;