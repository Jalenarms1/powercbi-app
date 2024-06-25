const router = require("express").Router()
const jwt = require('jsonwebtoken');
const loginRouter = require("./login")
const getMeRouter = require("./get-me")
const containerRouter = require("./container")
const masterListRouter = require("./master-lists")
const reportRouter = require("./report")

router.use('/api', loginRouter)
router.use('/api', getMeRouter)
router.use('/api', containerRouter)
router.use('/api', masterListRouter)
router.use('/api', reportRouter)


module.exports = router