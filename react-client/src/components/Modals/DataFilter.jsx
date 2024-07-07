import React, { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoCheckmark } from 'react-icons/io5'

export const DataFilter = ({openColumnFilter, clearColFilter, setOpenColumnFilter, data, toggleFilter, filters}) => {

    // add func to store separate list and submit  list of filters to help with check all
    const [compData, setCompData] = useState(null)
    const [optionsList, setOptionsList] = useState(null)

    const dedupArr = (arr) => {
        return Array.from(new Set(arr))
    }

    useEffect(() => {
        if(data) {
            setCompData(data)

        }
    }, [compData])

    useEffect(() => {
        if(compData) {
            setOptionsList(dedupArr(compData.map(d => d[openColumnFilter])))
        }
    }, [compData])

    const handleSearchInput = (e) => {
        const {value} = e.target 
        if(value.trim() != '') {
            setOptionsList(optionsList.filter(o => o.toLowerCase().includes(value.toLowerCase())))
        } else {
            setOptionsList(dedupArr(compData.map(d => d[openColumnFilter])))
        }
    }

  return (
    <div className="fixed inset-0 z-[1] w-full bg-opacity-60">
            <div className=" bg-white shadow-md rounded-md shadow-zinc-400  flex flex-col h-96 mt-28 overflow-y-scroll w-1/2 mx-auto relative">
                <div className='border-b bg-slate-900 text-white flex justify-between p-2 sticky top-0'>
                    <p className='text-2xl font-semibold'>{openColumnFilter}</p>
                    <div className="flex gap-2">
                        <button onClick={() => setOpenColumnFilter(null)} className='p-1 border hover:bg-slate-800  rounded-md'>Close</button>
                    </div>
                </div>
                <div  className='flex items-center relative p-2 hover:bg-zinc-100'>
                    <input onChange={handleSearchInput} type="text" placeholder='Search for filter option...' className='w-full p-1' />
                    <CiSearch className='text-black font-semibold absolute right-5 top-3 text-xl'  />
                </div>
                <div  className='flex items-center justify-end relative p-2 '>
                    <button onClick={() => clearColFilter(openColumnFilter)} className="p-1 px-2 bg-zinc-200 shadow-sm shadow-zinc-200 active:scale-[.95]">Clear</button>
                </div>
                {optionsList && <div className="flex flex-col">
                    {optionsList.map((cv, indx) => (
                        <div onClick={() => toggleFilter(openColumnFilter, cv)} key={indx} className='flex items-center justify-between cursor-pointer p-2 hover:bg-zinc-100'>
                            <p  onClick={() => toggleFilter(openColumnFilter, cv)} className='text-black'>{cv}</p>
                            <button className={` shadow-sm shadow-zinc-300 ${filters.find(f => f.name == openColumnFilter)?.values.map(v => `${v}`).includes(`${cv}`) ? 'bg-blue-500' : 'bg-white'} `}>
                                <IoCheckmark className='text-white font-semibold' />
                            </button>
                        </div>
                    ))}

                </div>}
            </div>
        </div>
  )
}
