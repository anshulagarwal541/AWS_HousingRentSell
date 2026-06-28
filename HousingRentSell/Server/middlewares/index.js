require('dotenv').config();

const { verify } = require('jsonwebtoken');


const validateUser = async (req, res, next) => {
    const accessToken = req.header('accessToken');
    if (!accessToken) {
        return res.json({ error: "User must be logged in !!" });
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.user = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: "You have not yet signed up for this..!!" })
    }
}

const validateTeam = async (req, res, next) => {
    const accessMemberToken = req.header('accessMemberToken');
    if (!accessMemberToken) {
        return res.json({ error: "Member must be logged in !!" });
    }
    try {
        const validToken = verify(accessMemberToken, process.env.SECRET_KEY);
        if (validToken) {
            req.member = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: "You have not yet signed up for this..!!" })
    }
}

module.exports = {
    validateTeam,
    validateUser
};