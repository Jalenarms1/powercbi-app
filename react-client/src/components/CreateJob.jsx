import React, { useState } from 'react'
import Dropdown from './Dropdown'

export const CreateJob = ({currentReport}) => {

    const [jobTitle, setJobTitle] = useState(null)
    const [distribution, setDistribution] = useState(null)
  return (
    <div className='flex flex-col gap-4'>
        <div>
            <p className="text-xl font-semibold">Create a scheduled job for this report to execute.</p>
        </div>
        <div className="flex gap-10">
            <div className="flex flex-col gap-2">
                <label htmlFor="job-title">Title</label>
                <input type="text" placeholder='Title' className='shadow p-1 rounded-md placeholder:text-zinc-700'  />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="job-distribution">Distibution</label>
                <Dropdown label={'Choose a method'} options={[{name:'Email'}, {name:'File Drop'}]} onSelect={(val) => setDistribution(val)} />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="job-title">Distribute to:</label>
                <div className='flex flex-col'>
                    <input type="text" className='p-1 placeholder:text-zinc-700 shadow' placeholder={`Enter an email address`} />
                </div>
            </div>

        </div>
    </div>
  )
}
