import React, { useEffect, useState } from 'react'
import { get, put } from '../utils'
import DynamicTable from './DynamicTable'

export const Jobs = ({currentReport}) => {

    const [jobs, setJobs] = useState(null)
    const [jobsList, setJobsList] = useState(null)

    const getJobs = async () => {
        const {data} = await get(`/job/list?reportId=${currentReport?.uid}`)

        console.log(data);

        setJobs(data)
    }

    const onActiveToggle = async (jobId, val) => {
        const resp = await put('/job/toggle-active', {jobId, currVal: val})

        console.log(resp);
        getJobs()
    }

    useEffect(() => {

        getJobs()
    }, [])

    useEffect(() => {
        if(jobs) {
            setJobsList(jobs)
        }
    }, [jobs])

  return (
    <>
        {(jobsList && jobsList?.length > 0) ? <DynamicTable onActiveToggle={onActiveToggle} data={jobsList} columns={['title', 'distribution', 'distributeTo', 'nextRun', 'active']} /> : <p>None.</p>}
    </>
  )
}
