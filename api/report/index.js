const { execQuery, REPORT_TABLE } = require("../../dbconnect")

const router = require("express").Router()

const replaceApos = (str) => {
    return str .split("").map(c => c == "'" ? "''" : c).join("")
}

router.post('/report/add', async (req, res) => {
    const {title, dataSource, dataSourceType, columnList, user, containerId} = req.body

    

    const resp = await execQuery(`insert into ${REPORT_TABLE} (containerId, title, dataSource, dataSourceType, columnList, createdBy) values ('${containerId}','${replaceApos(title)}', '${replaceApos(dataSource)}', '${replaceApos(dataSourceType)}', '${replaceApos(columnList)}', '${replaceApos(user)}')`)

    console.log(resp);

    res.json(resp)
})

module.exports = router