import React, { useState } from 'react'
import Dropdown from './Dropdown'
import { TiDeleteOutline } from "react-icons/ti";


export const CreateJob = ({currentReport}) => {

    const [jobTitle, setJobTitle] = useState(null)
    const [distribution, setDistribution] = useState('')
    const [distributeTo, setDistributeTo] = useState([])
    const [distributeInput, setDistributeInput] = useState(null)
    const [emailErr, setEmailErr] = useState(false)

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleDistributionAdd = () => {
        setEmailErr(false)
        if (distributeInput.trim() !== '') {
            if(distribution == 'Email' && validateEmail(distributeInput)) {
            setDistributeTo([...distributeTo, distributeInput]);
            setDistributeInput(''); 
          } else if (distribution == 'Email' && !validateEmail(distributeInput)) {
            setEmailErr(true)
          }

        
        }
    };


  return (
    <div className='flex flex-col gap-4'>
        <div className='bg-zinc-200 shadow-sm shadow-zinc-400 w-fit pr-10 p-1'>
            <p className="text-xl font-semibold">Create a scheduled job for this report.</p>
        </div>
        <div className="flex gap-10">
            <div className="flex flex-col gap-2">
                <label htmlFor="job-title" className='font-semibold'>Title</label>
                <input type="text" placeholder='Title' className='shadow p-1 rounded-md placeholder:text-zinc-700'  />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="job-distribution" className='font-semibold'>Distibution</label>
                <Dropdown label={'Choose a method'} options={[{name:'Email'}, {name:'File Drop'}]} onSelect={(opt) => setDistribution(opt.name)} />
            </div>
            {distribution && <div className="flex flex-col gap-2">
                <label htmlFor="job-title" className='font-semibold'>Distribute to:</label>
                <div className='flex gap-2'>
                    <input value={distributeInput} onChange={(e) => setDistributeInput(e.target.value)} type="text" className='p-1 placeholder:text-zinc-700 shadow' placeholder={`Enter an email address`} />
                    <button onClick={handleDistributionAdd} className='bg-zinc-200 rounded-sm px-2 p-1 shadow-sm shadow-zinc-400 active:scale-[.95]'>+</button>
                </div>
                {emailErr && <p className='text-xs text-red-500'>Not a valid email</p>}
            </div>}

        </div>
        {distribution && <div className="flex flex-col gap-2">
            <p className='font-semibold'>Send to:</p>
            <div className="flex gap-3">
                {distributeTo.map((d, i) => (
                    <div className='bg-zinc-100 p-1 px-2 rounded-md flex gap-2 items-center'>
                        <TiDeleteOutline onClick={() => setDistributeTo(distributeTo.filter(v => v != d))} className='text-lg cursor-pointer' /> 
                        <p>{d}</p>
                    </div>
                ))}
            </div>
        </div>}
    </div>
  )
}
