const { getConnection, execQuery, CONTAINER_TABLE } = require("../../dbconnect")

const router = require("express").Router()

router.post('/container/add', async (req, res) => {
    const {label, description, roles} = req.body
    const createdBy = req.user.username


    const resp = await execQuery(`insert into ${CONTAINER_TABLE} (uid, label, description, rolesAllowed, createdBy) values (NEWID(), '${label.replace("'", "''")}', '${description.replace("'", "''")}', '${roles}', '${createdBy}')`)

    console.log(resp);
    res.json(resp)

})

router.get('/container/list', async (req, res) => {
    const resp = await execQuery(`select uid, label, description, rolesAllowed, createdAt from ${CONTAINER_TABLE} order by createdAt`)

    console.log('resp', resp);

    return res.json(resp)
})

router.get('/container/:id', async (req, res) => {
    console.log(req.params.id);
    const resp = await execQuery(`select uid, label, description, rolesAllowed from ${CONTAINER_TABLE} where uid = '${req.params.id}'`)

    return res.json(resp)
})


module.exports = router