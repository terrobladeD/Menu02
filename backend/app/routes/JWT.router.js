const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

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

        const users = [
            { 'username': "123456", "password": "$2b$10$KHiyRA36cLTKOZdQ5uvquui7e6EM5PMQB5gXpcnFh4dFWJOqQ5Nj6" }//pwd:123456
        ];

        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const user = users.find((user) => user.username === username);

            if (!user) {
                return res.sendStatus(403);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.sendStatus(401);
            }

            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            res.json({ token });
        });

        // Protected route
        router.get('/protected', authenticateJWT, (req, res) => {
            res.json({ message: 'This is a protected endpoint' });
        });

        app.use('/', router);
    }
};
