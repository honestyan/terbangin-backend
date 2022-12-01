const jwt = require('jsonwebtoken');

const {
    JWT_SIGNATURE_KEY
} = process.env;

module.exports = {
    mustLogin: (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'you\'re not authorized!',
                    data: null
                });
            }

            const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);
            req.user = decoded;

            next();
        } catch (err) {
            if (err.message == 'jwt malformed') {
                return res.status(401).json({
                    status: false,
                    message: err.message,
                    data: null
                });
            }

            next(err);
        }
    },
    mustAdmin: (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: "you're not authorized!",
                    data: null
                });
            }

            const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);
            req.admin = decoded;
            const existadmin =  Admin.findOne({ where: { email: decoded.email } });

            if (!existadmin) {
                return res.status(403).json({
                  status: false,
                  message: "you're not admin !",
                });
            }
        
            next();
        } catch (err) {
            if (err.message == 'jwt malformed') {
                return res.status(401).json({
                    status: false,
                    message: err.message,
                    data: null
                });
            }

            next(err);
        }
    }
};