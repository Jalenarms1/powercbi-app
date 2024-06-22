const router = require("express").Router()
const jwt = require('jsonwebtoken');
const loginRouter = require("./login")
const getMeRouter = require("./get-me")

router.use('/api', loginRouter)
router.use('/api', getMeRouter)


module.exports = router