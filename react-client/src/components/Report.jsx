import React, { useEffect, useState } from 'react'
import { useReportContext } from '../context/ReportContext'
import { Link, useParams } from 'react-router-dom'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import MUIDataTable from "mui-datatables";
import { useContainerContext } from '../context/ContainerContext';
import { VscLoading } from "react-icons/vsc";
import { PreviewData } from './PreviewData';
import { ReportNav } from './ReportNav';



export const Report = () => {

    const {id} = useParams()
    const {currentReport, getReport, getReportData, currentReportData} = useReportContext()
    const {currentContainer, getContainer} = useContainerContext()
    const [currentView, setCurrentView] = useState('Preview Data')

    useEffect(() => {
        if(!currentReport || (currentReport && currentReport.uid != id)) {
            getReport(id)

        }
    }, [id])

    useEffect(() => {
        if(currentReport && !currentContainer) {
            getContainer(currentReport.containerId)

        }
    }, [currentReport])

    console.log('currentReport', currentReport);

    const toggleView = (option) => {
        setCurrentView(option)
    }

  return (
    <div className='flex flex-col p-3 w-full gap-4 overflow-y-hidden'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <div className="flex justify-between w-full">
                <div className="flex flex-col gap-2">
                    {currentReport && <p className="text-3xl text-black font-semibold">{currentReport.title}</p>}
                    {currentContainer && <Link to={`/container/${currentContainer.uid}`} className="text-xl text-zinc-400 hover:underline hover:text-zinc-300">{currentContainer.label}</Link>}

                </div>
                <div className='flex gap-4 items-end'>
                    <ReportNav option={'Preview Data'} active={currentView == 'Preview Data'} onClick={() => toggleView('Preview Data')} />
                    <ReportNav option={'Create Job'} active={currentView == 'Create Job'} onClick={() => toggleView('Create Job')}/>
                    <ReportNav option={'Job Logs'} active={currentView == 'Job Logs'} onClick={() => toggleView('Job Logs')}/>
                </div>
            </div>

            {/* <AiTwotoneFolderAdd title='Add new report' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' /> */}
        </div>
        {currentView == 'Preview Data' ? <PreviewData currentReport={currentReport} currentReportData={currentReportData} getReportData={getReportData} id={id} /> : currentView == 'Create Job' ? <div>Create Job</div> :
        currentView == 'Job Logs' ? <div>Job Logs</div> : <div>None</div>}
        {/* <PreviewData currentReport={currentReport} currentReportData={currentReportData} getReportData={getReportData} id={id} /> */}
    </div>
  )
}
