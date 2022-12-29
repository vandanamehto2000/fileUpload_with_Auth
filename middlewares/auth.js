const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; //["Bearer" "{token}"]
        if (!authHeader) {
            return res.status(401).json({ err: "authorization header not found" })
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ err: "token not found" })
        }

        const secretKey = process.env.SECRET_KEY;

        const decode = jwt.verify(token, secretKey);

        const user = await User.findOne({ where: { id: decode.user.id } });
        if (!user) {
            return res.status(404).json({ err: "user not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).send(err);
    }

}


const isSeller = async (req, res, next) => {
    if (req.user.dataValues.isSeller) {
        next();
    }
    else {
        return res.status(401).json({ err: "you are not seller" })
    }

}

module.exports = { isAuthenticated, isSeller }