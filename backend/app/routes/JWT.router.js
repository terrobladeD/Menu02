const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const db = require("../models");
const stores = db.stores;


function authenticateJWT(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = {
    authenticateJWT,
    configureRoutes: app => {
        var router = require("express").Router();

        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            const user = await stores.findOne({ where: { email } });

            if (!user) {
                return res.sendStatus(403);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(await bcrypt.hash(password, 10));
            //for store1password and store2password
            if (!isPasswordValid) {
                return res.sendStatus(401);
            }

            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            res.json({ token });
        });

        // Protected route
        router.get('/protected', authenticateJWT, (req, res) => {
            res.json({ message: 'This is a protected endpoint showing yout token is valid now' });
        });

        app.use('/', router);
    }
};