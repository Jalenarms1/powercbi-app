const { JOB_TABLE, execQuery } = require("../../dbconnect")

const router = require("express").Router()

function formatToSQLDateTime(input) {
    // Define a regex to parse the input string
    const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}) (AM|PM)$/;
    const match = input.match(regex);
  
    if (!match) {
      throw new Error("Invalid date format");
    }
  
    let [_, year, month, day, hour, period] = match;
    
    // Convert hour to 24-hour format
    hour = parseInt(hour);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
  
    // Format each component to ensure two digits
    month = String(month).padStart(2, '0');
    day = String(day).padStart(2, '0');
    hour = String(hour).padStart(2, '0');
    const minutes = '00'; 
    const seconds = '00'; 
  
    // Combine into the final datetime string
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

router.post("/job/add", async (req, res) => {
    const {reportId, title, distributeTo, distribution, frequency, startDate, hour} = req.body

    const nextRun = formatToSQLDateTime(`${startDate} ${hour}`)
    console.log(nextRun);
    const query = `insert into ${JOB_TABLE} (reportId, title, distribution, distributeTo, frequency, nextRun, hour) values ('${reportId}', '${title}', '${distribution}', '${distributeTo}', '${frequency}', '${nextRun}', '${hour}')`

    const resp = await execQuery(query)

    res.json(resp)
})

router.get('/job/list', async (req, res) => {
    const {reportId} = req.query

    const query = `select * from ${JOB_TABLE} where reportId = '${reportId}'`

    const resp = await execQuery(query)

    res.json(resp)
})

router.put('/job/toggle-active', async (req, res) =>  {
    const {jobId, currVal} = req.body

    let val = currVal == 1 ? 0 : 1

    const query = ` update ${JOB_TABLE} set active = '${val}' where uid = '${jobId}'`

    const resp = await execQuery(query)

    res.json(resp)


})



module.exports = router