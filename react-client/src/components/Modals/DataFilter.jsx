import React from 'react'
import { IoCheckmark } from 'react-icons/io5'

export const DataFilter = ({setCheckAll, checkAll, openColumnFilter, setOpenColumnFilter, data, currentReportData, toggleFilter}) => {

    // add func to store separate list and submit  list of filters to help with check all

    const dedupArr = (arr) => {
        return Array.from(new Set(arr))
    }

  return (
    <div className="fixed inset-0 z-[1] w-full bg-opacity-60">
            <div className=" bg-white shadow-md rounded-md shadow-zinc-400  flex flex-col h-96 mt-28 overflow-y-scroll w-1/2 mx-auto relative">
                <div className='border-b bg-slate-900 text-white flex justify-between p-2 sticky top-0'>
                    <p className='text-2xl font-semibold'>{openColumnFilter}</p>
                    <button onClick={() => setOpenColumnFilter(null)} className='p-1 border hover:bg-slate-800  rounded-md'>Close</button>
                </div>
                <div onClick={() => setCheckAll(!checkAll)} className='flex items-center justify-between cursor-pointer p-2 hover:bg-zinc-100'>
                    <p>Check all</p>
                    <button className={` shadow-sm shadow-zinc-300 ${data.map(d => d[openColumnFilter]).length == currentReportData.map(d=> d[openColumnFilter]).length ? 'bg-blue-500' : 'bg-white'} `}>
                        <IoCheckmark className='text-white font-semibold' />
                    </button>
                </div>
                <div className="flex flex-col">
                    {dedupArr(currentReportData.map(d => d[openColumnFilter])).map((cv, indx) => (
                        <div onClick={() => toggleFilter(openColumnFilter, cv)} key={indx} className='flex items-center justify-between cursor-pointer p-2 hover:bg-zinc-100'>
                            <p  onClick={() => toggleFilter(openColumnFilter, cv)} className='text-black'>{cv}</p>
                            <button className={` shadow-sm shadow-zinc-300 ${data.filter(d => d[openColumnFilter] == cv).length > 0 ? 'bg-blue-500' : 'bg-white'} `}>
                                <IoCheckmark className='text-white font-semibold' />
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </div>
  )
}
