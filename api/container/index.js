const { getConnection, execQuery } = require("../../dbconnect")

const router = require("express").Router()

router.post('/container/add', async (req, res) => {
    const {label, description, roles} = req.body
    const createdBy = req.user.username


    const resp = await execQuery(`insert into Container (uid, label, description, rolesAllowed, createdBy) values (NEWID(), '${label.replace("'", "''")}', '${description.replace("'", "''")}', '${roles}', '${createdBy}')`)

    console.log(resp);
    res.json(resp)

})

router.get('/container/list', async (req, res) => {
    const resp = await execQuery('select uid, label, description, rolesAllowed from Container order by createdAt')

    return res.json(resp)
})

router.get('/container/:id', async (req, res) => {
    const resp = await execQuery(`select uid, label, description, rolesAllowed from Container where uid = '${req.params.id}'`)

    return res.json(resp)
})


module.exports = router