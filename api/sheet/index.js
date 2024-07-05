const { execQuery, SHEET_TABLE } = require("../../dbconnect")

const router = require("express").Router()


const replaceApos = (str) => {
    return str .split("").map(c => c == "'" ? "''" : c).join("")
}

router.get('/sheet', async (req, res) => {
    const {sheetId, dataSource, dataSourceType, columnList} = req.query

    
    let dataQuery;
    
    if (dataSourceType == 'VIEW') {
        dataQuery = `select ${columnList.split(",").map(c => `[${c}]`).join(",")} from ${dataSource}`
    } else {
        
        dataQuery = `exec ${dataSource};`
    }
    
    console.log(dataQuery);
    const resp = await execQuery(dataQuery)

    res.json(resp)
})

router.post('/sheet/add', async (req, res) => {
    const {reportId, dataSource, dataSourceType, dataQuery, columnList, sheetTitle} = req.body

    const resp = await execQuery(`insert into ${SHEET_TABLE} (reportId, title, dataQuery, dataSource, dataSourceType, columnList, createdBy) values ('${reportId}', '${sheetTitle}', '${dataQuery}', '${dataSource}', '${dataSourceType}', '${columnList}', '${req.user.username}')`)

    res.json(resp)
})

module.exports = router