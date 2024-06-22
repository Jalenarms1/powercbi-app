const router = require("express").Router()
const jwt = require('jsonwebtoken');
const loginRouter = require("./login")
const getMeRouter = require("./get-me")
const containerRouter = require("./container")

router.use('/api', loginRouter)
router.use('/api', getMeRouter)
router.use('/api', containerRouter)


module.exports = router