import React, { useEffect, useState } from 'react'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { ListItem } from './ListItem'
import { useContainerContext } from '../context/ContainerContext'
import { NewReport } from './Modals/NewReport'
import { useReportContext } from '../context/ReportContext'
import { CiSearch } from 'react-icons/ci'

export const Container = () => {

    const {id} = useParams()
    const {getContainer, currentContainer} = useContainerContext()
    const {getReports, reports} = useReportContext()
    const [openNewReport, setOpenNewReport] = useState(false)
    const [reportList, setReportList] = useState(null)

    console.log(currentContainer);

    const handleSearchInput = (e) => {
        const {value} = e.target 
        if (value.trim() == '') {
            setReportList(reports)
        } else {
            setReportList(reportList.filter(r => r.title.toLowerCase().includes(value.toLowerCase())))
        }
    }

    useEffect(() => {
        getContainer(id)
        getReports(id)
    }, [id])

    useEffect(() => {
        if(reports) {
            setReportList(reports)
        }
    }, [reports])

    const toggleNewReport = () => {
        setOpenNewReport(!openNewReport)
    }

  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <div className="flex flex-col gap-2">
                {currentContainer && <p className="text-3xl text-black font-semibold">{currentContainer.label} - Reports</p>}
                {currentContainer && <p className="text-xl text-zinc-400">{currentContainer.description}</p>}

            </div>
            <div className="flex items-end gap-2">
                <div className="relative">
                    <input onChange={handleSearchInput} type="text" className='p-1 rounded-md bg-zinc-200 shadow-sm shadow-zinc-200 pr-8' placeholder='Search for a report' />
                    <CiSearch className='absolute right-2 top-2' />
                </div>

                <AiTwotoneFolderAdd onClick={toggleNewReport} title='Add new report' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' />
                {openNewReport && <NewReport containerId={id} closeModal={toggleNewReport} />}

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
