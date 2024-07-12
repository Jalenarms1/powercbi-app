const { execQuery, REPORT_TABLE, SHEET_TABLE } = require("../../dbconnect")
const { replaceApos, getReportWithSheets } = require("../../helpers")
const { redisGet, redisAdd } = require("../../redis")
const {v4: uuid} = require("uuid")

const router = require("express").Router()



router.post('/report/add', async (req, res) => {
    const {title, dataSource, parameters, dataSourceType, columnList, user, containerId} = req.body

    const now = new Date().toISOString()

    const reportId = uuid()

    const resp = await execQuery(`insert into ${REPORT_TABLE} (uid, containerId, title, createdBy) values ('${reportId}', '${containerId}','${replaceApos(title)}', '${replaceApos(user)}')`)

    console.log(resp);

    let dataQuery;
    
    if (dataSourceType == 'VIEW') {
        dataQuery = `select ${columnList.split(",").map(c => `[${c}]`.trim()).join(",")} from ${dataSource}`
    } else {
        dataQuery = `exec ${replaceApos(dataSource)} ${replaceApos(parameters)};`
    }
    
    const addInitDataSheet = await execQuery(`insert into ${SHEET_TABLE} (reportId, title, dataSource, parameters, dataSourceType, dataQuery, columnList, createdBy) values ('${reportId}','${replaceApos(title)}', '${replaceApos(dataSource)}', '${replaceApos(parameters)}', '${replaceApos(dataSourceType)}', '${dataQuery}', '${replaceApos(columnList)}', '${replaceApos(user)}')`)

    res.json(resp)
})

router.get('/report/list', async (req, res) => {
    const containerId = req.query.containerId

    const data = await execQuery(`select uid, containerId, title, createdBy, createdAt  from ${REPORT_TABLE} where containerId = '${containerId}' order by createdAt`)

    res.json(data)
})

router.get(`/report/find`, async (req, res) => {
    const {reportId} = req.query

    console.log(`select r.uid, r.containerId, r.title, s.title as [sheetTitle], s.dataSource, s.dataSourceType, s.columnList, r.createdBy, r.createdAt from ${REPORT_TABLE} r left join ${SHEET_TABLE} s on r.uid = s.reportId where r.uid = '${reportId}'`);

    // const data = await execQuery(`select r.uid, s.uid as [sheetId], r.containerId, r.title, s.title as [sheetTitle], s.dataQuery, s.dataSource, s.parameters, s.dataSourceType, s.columnList, s.filters, s.orderBy, r.createdBy, r.createdAt from ${REPORT_TABLE} r left join ${SHEET_TABLE} s on r.uid = s.reportId where r.uid = '${reportId}' order by s.createdAt`)
    

    // // console.log('data', data);
    // let sheets = []
    // for (const s of data) {
    //     const {sheetTitle, sheetId, dataQuery, dataSource, dataSourceType, columnList, filters, orderBy, parameters} = s

    //     const obj = {
    //         uid: sheetId, 
    //         sheetTitle, 
    //         dataQuery, 
    //         dataSource, 
    //         dataSourceType, 
    //         columnList, 
    //         filters, 
    //         orderBy, 
    //         parameters
    //     }

    //     let data = await redisGet(sheetId)
        
    //     if(data) {
    //         obj.data = data
    //     } 

    //     sheets.push(obj)
    // }

    // res.json({uid: data[0].uid, title: data[0].title, containerId: data[0].containerId, createdBy: data[0].createdBy, createdAt: data[0].createdAt, sheets: [...sheets]})

    const newReport = await getReportWithSheets(reportId)

    res.json(newReport)
    
})

router.get('/report/data', async (req, res) => {
    const {dataSource, dataSourceType, columnList, reportId} = req.query

    let dataQuery;

    if (dataSourceType == 'VIEW') {
        dataQuery = `select ${columnList.split(",").map(c => `[${c}]`).join(",")} from ${dataSource}`
    } else {
        dataQuery = `select into #sp_data 
        exec ${dataSource};
        
        select ${columnList.split(",").map(c => `[${c}]`).join(",")} from #sp_data;
        
        drop table #sp_data;`
    }

    const newSheetQuery = `insert into ${SHEET_TABLE} (reportId, title, dataSource, dataSourceType, columnList) values ('${reportId}') `

    console.log('dataQuery', dataQuery);

    const data = await execQuery(dataQuery)

    console.log('data', data.length);

    await redisAdd(dataSource, data)

    // if(data.length > 100) {
    //     res.json({data: data.slice(0, 100), count: data.length})
    // } else {
    //     res.json({data})

    // }

    res.json({data})



})

router.get('/report/data/:page', async (req, res) => {
    const {redisKey, numberOfRecords} = req.query
    const {page} = req.params

    const data = await redisGet(redisKey)

    const start = (page - 1) * numberOfRecords;
    const end = start + recordsPerPage;

    res.json(data.slice(start, end))
})

router.get('/report/my-reports', async (req, res) => {
    const {user} = req.query

    const query = `select * from ${REPORT_TABLE} where createdBy = '${user}'`

    const resp = await execQuery(query)

    res.json(resp)
})

module.exports = router