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

    const data = await execQuery(`select uid, containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt  from ${REPORT_TABLE} where containerId = '${containerId}'`)

    res.json(data)
})

router.get(`/report/find`, async (req, res) => {
    const {reportId} = req.query

    const data = await execQuery(`select uid, containerId, title, dataSource, dataSourceType, columnList, createdBy, createdAt from ${REPORT_TABLE} where uid = '${reportId}'`)

    console.log(data[0]);

    let dataQuery;

    if (data[0].dataSourceType == 'VIEW') {
        dataQuery = `select ${data[0].columnList.split(",").map(c => `[${c}]`).join(",")} from ${data[0].dataSource}`
    } else {
        dataQuery = `select into #sp_data 
        exec ${data[0].dataSource};
        
        select ${data[0].columnList.split(",").map(c => `[${c}]`).join(",")} from #sp_data;
        
        drop table #sp_data;`
    }
    console.log('dataQuery', dataQuery);

    const dataResp = await execQuery(dataQuery)

    console.log('dataResp', {...data[0], data: dataResp});


    res.json({...data[0], data: dataResp})
    
})

module.exports = router