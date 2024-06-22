const router = require("express").Router()
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY

router.post('/login', (req, res) => {
    const { username } = req.body;
    console.log(username);
    // add logic to validate the username with acitve directory
    let validUser = true
    if (validUser) { // Replace with your own validation logic
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '7d' });
        return res.json({ token, username });
    }
    res.status(401).send('Invalid username');
})


module.exports = router