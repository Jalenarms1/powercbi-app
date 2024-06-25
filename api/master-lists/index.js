const { execQuery } = require("../../dbconnect")

const router = require("express").Router()

router.get('/master-list/data-sources', async (req, res) => {
    const viewData = await execQuery('select name, type_desc from sys.views')
    console.log(viewData);

    const spData = await execQuery('select name, type_desc from sys.procedures')

    return res.json([...viewData, ...spData])
})

router.get('/master-list/data-source-columns', async (req, res) => {
    if (req.query.type == 'VIEW') {
        const query = `SELECT 
            COLUMN_NAME,
            DATA_TYPE,
            CHARACTER_MAXIMUM_LENGTH,
            IS_NULLABLE
        FROM 
            INFORMATION_SCHEMA.COLUMNS
        WHERE 
            TABLE_NAME = '${req.query.name}'
        `
        const resp = await execQuery(query)

        const columns = resp.map(r => {
            const {COLUMN_NAME, DATA_TYPE} = r

            return {
                name: COLUMN_NAME, 
                dataType: DATA_TYPE,
                include: true
            }
        })
    
        console.log(columns);
        return res.json(columns)

    } else {
        try {
            const query = `SET FMTONLY ON;
            ${req.query.exec};
            SET FMTONLY OFF;
            `
            console.log('query', query);
    
            const resp = await execQuery(query)
    
            console.log(resp.columns);
    
            const columns = resp.columns.map(r => {
                const {name, dataTypeName} = r
    
                return {
                    name, 
                    dataType: dataTypeName,
                    include: true
                }
            })
    
            res.json(columns)
            
        } catch (error) {
            res.json({error: 'Error retrieving column info. Please make sure you have entered all necessary parameters.'})
        }
    }
})

module.exports = router