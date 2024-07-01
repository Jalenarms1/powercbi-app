import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import { TiDeleteOutline } from "react-icons/ti";
import { getNextOccurrence, getTomorrowDate, post } from '../utils';


export const CreateJob = ({currentReport}) => {

    const [title, setTitle] = useState('')
    const [distribution, setDistribution] = useState('')
    const [distributeTo, setDistributeTo] = useState([])
    const [distributeInput, setDistributeInput] = useState(null)
    const [emailErr, setEmailErr] = useState(false)
    const [frequency, setFrequency] = useState(null)
    const [day, setDay] = useState(null)
    const [hour, setHour] = useState(null)
    const [nextRunTime, setNextRunTime] = useState(null)
    const [jobConfirm, setJobConfirm] = useState(false)
    const [inputErr, setInputErr] = useState(false)



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
          } else if (distribution == 'File Drop') {
            setDistributeTo([...distributeTo, distributeInput])
            setDistributeInput('')
          }

        
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
          console.log('Enter key pressed');
          handleDistributionAdd()
        }
        };

    const hours = [
        {name:'12 AM'}, {name:'1 AM'}, {name:'2 AM'}, {name:'3 AM'}, {name:'4 AM'}, {name:'5 AM'}, {name:'6 AM'}, {name:'7 AM'}, {name:'8 AM'}, {name:'9 AM'}, {name:'10 AM'}, {name:'11 AM'},
        {name:'12 PM'}, {name:'1 PM'}, {name:'2 PM'}, {name:'3 PM'}, {name:'4 PM'}, {name:'5 PM'}, {name:'6 PM'}, {name:'7 PM'}, {name:'8 PM'}, {name:'9 PM'}, {name:'10 PM'}, {name:'11 PM'}
    ];

    useEffect(() => {
        if(day && hour) {
            setNextRunTime(`${day} ${hour}`)
        }
    }, [day, hour, frequency])

    useEffect(() => {
        if(distribution) {
            setDistributeTo([])
        }
    }, [distribution])

    const handleSubmitJob = async () => {
        setInputErr(false)
        if(title.trim() != '' && distributeTo?.length > 0 && frequency && day && hour) {
            console.log({title, distributeTo, frequency, day, hour});

            const resp = await post('/job/add', {reportId: currentReport.uid, title, distribution, distributeTo: distributeTo.join(', '), frequency, startDate: day, hour})

            console.log(resp);

            if(resp.status == 200) {
                window.location.replace(`/report/${currentReport.uid}?view=Jobs`)
            } else {
                setInputErr(true)
            }

            // window.location.reload()
            
        } else {
            console.log('error');
            setInputErr(true)
        }
    }


  return (
    <div className='flex flex-col gap-10  pb-44'>
        <div className="flex flex-col gap-4">

            <div className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1'>
                <p className="text-xl font-semibold">Create a scheduled job for this report.</p>
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col gap-2">
                    <label htmlFor="job-title" className='font-semibold'>Title</label>
                    <input maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' className='shadow p-1 rounded-md placeholder:text-zinc-700'  />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="job-distribution" className='font-semibold'>Distibution</label>
                    <Dropdown label={'Choose a method'} options={[{name:'Email'}, {name:'File Drop'}]} onSelect={(opt) => setDistribution(opt.name)} />
                </div>
                {distribution && <div className="flex flex-col gap-2">
                    <label htmlFor="job-title" className='font-semibold'>Distribute to:</label>
                    <div className='flex gap-2'>
                        <input onKeyDown={handleKeyDown} value={distributeInput} onChange={(e) => setDistributeInput(e.target.value)} type="text" className='p-1 placeholder:text-zinc-700 shadow' placeholder={`Enter ${distribution == 'Email' ? 'an email address' : 'a file path'}`} />
                        <button  onClick={handleDistributionAdd} className='bg-zinc-200 rounded-sm px-2 p-1 shadow-sm shadow-zinc-400 active:scale-[.95]'>+</button>
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
        <div className="flex flex-col gap-2">

            <div className="flex gap-4 items-center">
                <p className='font-semibold'>Schedule</p>
                {nextRunTime && <p className='text-sm'>First run - <span className='ml-1'>{nextRunTime}</span></p>}
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="job-frequency">Frequency</label>
                        <Dropdown label={'Select a frequency'} options={[{name: 'Daily'}, {name: 'Weekly'}, {name: 'Bi-Weekly'}, {name: 'Monthly'}]} onSelect={(opt) => setFrequency(opt.name)}  />
                    </div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <label htmlFor="job-day">Start Date</label>
                    <input min={getTomorrowDate()} value={day} onChange={(e) => setDay(e.target.value)} type='date' className=' p-1 shadow border' />
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="job-frequency">Hour of Day</label>
                    <Dropdown label={'Select an hour'} options={hours} onSelect={(opt) => setHour(opt.name)}  />
                </div>
                
            

            </div>
        </div>
        {distributeTo?.length > 0 && frequency && day && hour && <div className='flex gap-3'>
            <div onClick={() => setJobConfirm(!jobConfirm)} className={`w-5 h-5 ${jobConfirm ? 'bg-blue-500' : 'bg-zinc-300'} shadow-sm shadow-zinc-400  rounded-md cursor-pointer`}></div>
            <div onClick={() => setJobConfirm(!jobConfirm)} className="flex flex-col">
                <p className='cursor-pointer'>Please confirm {`${distribution == 'Email' ? 'an email will be sent to the following email(s):' : 'a file will be saved to the following location(s)'} ${frequency} at ${hour} starting ${day}:`}</p>
                <p>{distributeTo.join(",")}</p>
            </div>
        </div>}
        <div className='flex flex-col gap-2'>
            <button onClick={handleSubmitJob} className={`p-1 px-2 rounded-sm w-fit active:scale-[.95]  ${jobConfirm ? 'bg-green-400 text-white' : 'bg-zinc-300 text-zinc-400'}`} disabled={!jobConfirm}>Create</button>
            {inputErr && <p className='text-red-500'>Please make sure all fields have been completed.</p>}
        </div>
    </div>
  )
}
