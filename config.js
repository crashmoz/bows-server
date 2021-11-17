require('dotenv').config();

module.exports = {
    jwtSecret: process.env.SECRET,
    jwtSession: {
        session: false
    }
};