import React, { useState } from 'react'
import Dropdown from './Dropdown'

export const CreateJob = ({currentReport}) => {

    const [jobTitle, setJobTitle] = useState(null)
    const [distribution, setDistribution] = useState(null)
  return (
    <div className='flex flex-col gap-4'>
        <div>
            <p className="text-xl">Create a scheduled job for this report to execute.</p>
        </div>
        <div className="flex gap-8">
            <div className="flex flex-col gap-2">
                <label htmlFor="job-title">Title</label>
                <input type="text" placeholder='Title' className='shadow-sm shadow-zinc-300 p-1 rounded-md' />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="job-title">Distibution</label>
                <Dropdown label={'Choose a method'} options={[{name:'Email'}, {name:'File Drop'}]} onSelect={(val) => setDistribution(val)} />
            </div>

        </div>
    </div>
  )
}
