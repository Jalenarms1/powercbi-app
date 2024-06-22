const router = require("express").Router()


router.get('/get-me', (req, res) => {
    console.log(req.user);
    return res.json({user: req.user})
})

module.exports = router