const { execQuery, REPORT_TABLE } = require("../../dbconnect")

const router = require("express").Router()

const replaceApos = (str) => {
    return str .split("").map(c => c == "'" ? "''" : c).join("")
}

router.post('/report/add', async (req, res) => {
    const {title, dataSource, dataSourceType, columnList, user, containerId} = req.body

    const now = new Date().toISOString()

    const resp = await execQuery(`insert into ${REPORT_TABLE} (containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt) values ('${containerId}','${replaceApos(title)}', '${replaceApos(dataSource)}', '${replaceApos(dataSourceType)}', '${replaceApos(columnList)}', '${replaceApos(user)}', '${now}')`)

    console.log(resp);

    res.json(resp)
})

router.get('/report/list', async (req, res) => {
    const containerId = req.query.containerId

    const data = await execQuery(`select uid, containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt  from ${REPORT_TABLE} where containerId = '${containerId}'`)

    res.json(data)
})

module.exports = router