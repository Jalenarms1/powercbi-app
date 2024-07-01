import React, { useState } from 'react'
import { CgCloseR } from "react-icons/cg";


export const UpdateJob = ({job, closeModal}) => {

    const [updJob, setUpdJob] = useState({...job})


    const updateJobState = (key, val) => {
        setUpdJob({...updJob, [key]: val})
    }


  return (
    <div className='fixed inset-0 mt-16 z-[1] w-full'>
        <div className="w-3/4 bg-white h-96 mx-auto rounded-md shadow-md shadow-zinc-400 flex flex-col">
            <div className="flex justify-between p-4 bg-zinc-200 border-b rounded-md shadow-sm shadow-zinc-400">
                <p className='text-2xl font-semibold'>{job.title}</p>
                <CgCloseR onClick={closeModal}  className='text-3xl cursor-pointer active:scale-[.95]'/>
            </div>
            <div className="flex">
                <div className="flex flex-col">
                    <label htmlFor="title-upd">Title: {job.title}</label>
                    <input onChange={(e) => updateJobState('title', e.target.value)} type="text" className='p-1 shadow-sm shadow-zinc-300' />
                </div>
            </div>
        </div>
    </div>
  )
}
