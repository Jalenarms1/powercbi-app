import React, { useEffect, useState } from 'react'
import { get, put } from '../utils'
import DynamicTable from './DynamicTable'
import { VscLoading } from 'react-icons/vsc'
import { UpdateJob } from './Modals/UpdateJob'

export const Jobs = ({currentReport}) => {

    const [jobs, setJobs] = useState(null)
    const [jobsList, setJobsList] = useState(null)
    const [selectedJob, setSelectedJob] = useState(null)

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
        if(currentReport?.uid) {
            getJobs()

        }
    }, [currentReport])

    useEffect(() => {
        if(jobs) {
            setJobsList(jobs)
        }
    }, [jobs])

  return (
    <div className='flex flex-col gap-2 relative'>
        {selectedJob && <UpdateJob job={selectedJob} closeModal={() => setSelectedJob(null)} />}
        <p className="text-xl font-semibold p-2">Jobs</p>
        {(jobsList && jobsList?.length > 0) ? <DynamicTable onUpdateToggle={(job) => setSelectedJob(job)} onActiveToggle={onActiveToggle} data={jobsList} columns={['title', 'distribution', 'distributeTo', 'nextRun', 'active']} /> : <p>None.</p>}
    </div>
  )
}
