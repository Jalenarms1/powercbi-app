const { getConnection } = require("../../dbconnect")

const router = require("express").Router()

router.post('/container/add', async (req, res) => {
    const {label, description, roles} = req.body
    const createdBy = req.user.username

    const connection = await getConnection()

    const resp = await connection.query(`insert into Container (uid, label, description, createdBy) values (NEWID(), '${label.replace("'", "''")}', '${description.replace("'", "''")}', '${createdBy}')`)
    console.log(resp);
    res.json(resp)
    connection.close()

})


module.exports = router