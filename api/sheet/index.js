const { execQuery, SHEET_TABLE } = require("../../dbconnect");
const { replaceApos, getReportWithSheets } = require("../../helpers");
const { redisGet, redisAdd, redisDel } = require("../../redis");
const {v4: uuid} = require("uuid")

const router = require("express").Router()


router.get('/sheet', async (req, res) => {
    const {sheetId, dataSource, dataSourceType, columnList, parameters} = req.query

    
    let dataQuery;
    
    if (dataSourceType == 'VIEW') {
        dataQuery = `select ${columnList.split(",").map(c => `[${c}]`).join(",")} from ${dataSource}`
    } else {
        
        dataQuery = `exec ${dataSource} ${parameters.split(",").map(p => `'${p}'`).join(",")};`
    }

    try {
        console.log(dataQuery);

        let data = await redisGet(sheetId)

        if (!data) {
            data = await execQuery(dataQuery)

            await redisAdd(sheetId, data)
        }

        // const resp = await execQuery(dataQuery)
    
        // console.log(dataQuery, data);
    
        res.json(data)
        
    } catch (error) {
        console.log(error);
        res.json({err: 'Error getting data.'})
    }
    
})

router.post('/sheet/add', async (req, res) => {
    const {reportId, dataSource, dataSourceType, dataQuery, columnList, sheetTitle, parameters, uid} = req.body

    const newUid = uuid().toUpperCase()

    const resp = await execQuery(`insert into ${SHEET_TABLE} (uid, reportId, title, dataQuery, parameters, dataSource, dataSourceType, columnList, createdBy) values ('${newUid}', '${reportId}', '${replaceApos(sheetTitle)}', '${replaceApos(dataQuery)}', ${parameters ? `'${replaceApos(parameters)}'` : 'NULL'}, '${replaceApos(dataSource)}', '${dataSourceType}', '${replaceApos(columnList)}', '${replaceApos(req.user.username)}')`)

    let data = await redisGet(uid)
    
    if (data) {
        console.log('data existing');
        await redisAdd(newUid, data)
    }

    const currReport = await getReportWithSheets(reportId)

    res.json({newUid})
})

router.put('/sheet/update', async (req, res) => {
    const updArr = []
    const {sheetId} = req.query

    const updFieldList = Object.keys(req.body)

    updFieldList.forEach(k => {
        updArr.push(`${k} = '${replaceApos(req.body[k])}'`)
    })

    if (updFieldList.includes('dataSource')) {
        updArr.push('filters = NULL, orderBy = NULL')
    }

    if (!updFieldList.includes('title')) {

        await redisDel(sheetId)
    }

    
    const query = `update ${SHEET_TABLE} set ${updArr.join(", ")} where uid = '${sheetId}'`

    const resp = await execQuery(query)

    console.log('resp', resp);

    const getSheet = await execQuery(`select *, title as [sheetTitle] from ${SHEET_TABLE} where uid = '${sheetId}'`)

    console.log(getSheet[0]);

    res.json(getSheet[0])
})

router.delete('/sheet/remove', async (req, res) => {
    const {sheetId} = req.query

    const query = `delete from ${SHEET_TABLE} where uid = '${sheetId}'`

    const resp = await execQuery(query)

    res.json(resp)
})

module.exports = router