const { execQuery, REPORT_TABLE, SHEET_TABLE } = require("./dbconnect")
const { redisGet } = require("./redis")

const replaceApos = (str) => {
    return str ? str.split("").map(c => c == "'" ? "''" : c).join("") : ''
}

const getReportWithSheets = async (reportId) => {
    const data = await execQuery(`select r.uid, s.uid as [sheetId], r.containerId, r.title, s.title as [sheetTitle], s.dataQuery, s.dataSource, s.parameters, s.dataSourceType, s.columnList, s.filters, s.orderBy, r.createdBy, r.createdAt from ${REPORT_TABLE} r left join ${SHEET_TABLE} s on r.uid = s.reportId where r.uid = '${reportId}' order by s.createdAt`)
    

    // console.log('data', data);
    let sheets = []
    for (const s of data) {
        const {sheetTitle, sheetId, dataQuery, dataSource, dataSourceType, columnList, filters, orderBy, parameters} = s

        const obj = {
            uid: sheetId, 
            sheetTitle, 
            dataQuery, 
            dataSource, 
            dataSourceType, 
            columnList, 
            filters, 
            orderBy, 
            parameters
        }

        let data = await redisGet(sheetId)
        
        if(data) {
            obj.data = data
        } 

        sheets.push(obj)
    }

    return {uid: data[0].uid, title: data[0].title, containerId: data[0].containerId, createdBy: data[0].createdBy, createdAt: data[0].createdAt, sheets: [...sheets]}
}

module.exports = {
    replaceApos,
    getReportWithSheets
}