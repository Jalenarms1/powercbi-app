import React, { useEffect, useState } from 'react'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { ListItem } from './ListItem'
import { useReportContext } from '../context/ReportContext'

export const MyReports = () => {

  const {myReports} = useReportContext()
  const [reportList, setReportList] = useState(null)

  const handleSearchInput = (e) => {
    const {value} = e.target 
    if (value.trim() == '') {
      setReportList(myReports)
    } else {
      setReportList(myReports.filter(r => r.title.toLowerCase().includes(value.toLowerCase())))
    }
  }

  useEffect(() => {
    if(myReports && myReports.length > 0) {
      setReportList(myReports)
    }
  }, [myReports])

  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-3xl text-black font-semibold">My Reports</p>

            </div>
            <div className="flex items-end gap-2">
                <div className="relative">
                    <input onChange={handleSearchInput} type="text" className='p-1 rounded-md bg-zinc-200 shadow-sm shadow-zinc-200 pr-8' placeholder='Search for a report' />
                    <CiSearch className='absolute right-2 top-2' />
                </div>

                {/* <AiTwotoneFolderAdd onClick={toggleNewReport} title='Add new report' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' /> */}

            </div>
        </div>
        <div className="flex flex-wrap gap-4">
            {(reportList && reportList?.length > 0) && reportList?.map((r, i) => (
                <ListItem item={r} label={r.title} />

            ))}
            
        </div>
    </div>
  )
}
