const { execQuery, REPORT_TABLE } = require("../../dbconnect")

const router = require("express").Router()

const replaceApos = (str) => {
    return str .split("").map(c => c == "'" ? "''" : c).join("")
}

router.post('/report/add', async (req, res) => {
    const {title, dataSource, dataSourceType, columnList, user, containerId} = req.body

    const now = new Date().toISOString()

    const resp = await execQuery(`insert into ${REPORT_TABLE} (containerId, title, dataSource, dataSourceType, columnList, createdBy) values ('${containerId}','${replaceApos(title)}', '${replaceApos(dataSource)}', '${replaceApos(dataSourceType)}', '${replaceApos(columnList)}', '${replaceApos(user)}')`)

    console.log(resp);

    res.json(resp)
})

router.get('/report/list', async (req, res) => {
    const containerId = req.query.containerId

    const data = await execQuery(`select uid, containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt  from ${REPORT_TABLE} where containerId = '${containerId}' order by createdAt`)

    res.json(data)
})

router.get(`/report/find`, async (req, res) => {
    const {reportId} = req.query

    const data = await execQuery(`select uid, containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt from ${REPORT_TABLE} where uid = '${reportId}'`)


    res.json({...data[0]})
    
})

router.get('/report/data', async (req, res) => {
    const {dataSource, dataSourceType, columnList} = req.query

    let dataQuery;

    if (dataSourceType == 'VIEW') {
        dataQuery = `select ${columnList.split(",").map(c => `[${c}]`).join(",")} from ${dataSource}`
    } else {
        dataQuery = `select into #sp_data 
        exec ${dataSource};
        
        select ${columnList.split(",").map(c => `[${c}]`).join(",")} from #sp_data;
        
        drop table #sp_data;`
    }
    console.log('dataQuery', dataQuery);

    const data = await execQuery(dataQuery)

    console.log('data', data);


    res.json(data)
})

router.get('/report/my-reports', async (req, res) => {
    const {user} = req.query

    const query = `select * from ${REPORT_TABLE} where createdBy = '${user}'`

    const resp = await execQuery(query)

    res.json(resp)
})

module.exports = router