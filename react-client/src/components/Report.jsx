import React, { useEffect, useState } from 'react'
import { useReportContext } from '../context/ReportContext'
import { Link, useLocation, useParams } from 'react-router-dom'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import { useContainerContext } from '../context/ContainerContext';
import { VscLoading } from "react-icons/vsc";
import { PreviewData } from './PreviewData';
import { ReportNav } from './ReportNav';
import { CreateJob } from './CreateJob';
import { Jobs } from './Jobs';



export const Report = () => {

    const {id} = useParams()
    const queryStr = new URLSearchParams(useLocation().search);
    const setView = queryStr.get('view')
    const {currentReport, getReport, getReportData, currentReportData} = useReportContext()
    const {currentContainer, getContainer} = useContainerContext()
    const [currentView, setCurrentView] = useState(setView ?? 'Preview Data')

    useEffect(() => {
        if(!currentReport || (currentReport && currentReport?.uid != id)) {
            getReport(id)

        }
    }, [id])

    useEffect(() => {
        if((currentReport && currentReport?.containerId) && !currentContainer) {
            getContainer(currentReport?.containerId)

        }
    }, [currentReport])

    console.log('currentReport', currentReport);

    const toggleView = (option) => {
        setCurrentView(option)
    }
    console.log('currentReport', currentReport);

  return (
    <div className='flex flex-col flex-1 p-3 gap-4 w-2/4 ml-2 pb-20'>
        <div className="w-full relative border-b border-zinc-700 p-2 flex justify-between items-center">
            <div className="flex justify-between w-full">
                <div className="flex flex-col gap-2">
                    {currentReport && <p className="text-4xl text-black font-semibold">{currentReport.title}</p>}
                    {currentContainer && <Link to={`/container/${currentContainer.uid}`} className="text-xl text-zinc-400 hover:underline hover:text-zinc-300">{currentContainer.label}</Link>}

                </div>
                <div className='flex gap-4 items-end'>
                    <ReportNav option={'Preview Data'} active={currentView == 'Preview Data'} onClick={() => toggleView('Preview Data')} />
                    <ReportNav option={'Jobs'} active={currentView == 'Jobs'} onClick={() => toggleView('Jobs')} />
                    <ReportNav option={'Create Job'} active={currentView == 'Create Job'} onClick={() => toggleView('Create Job')}/>
                    <ReportNav option={'Job Logs'} active={currentView == 'Job Logs'} onClick={() => toggleView('Job Logs')}/>
                </div>
            </div>

            
        </div>
        {(currentView == 'Preview Data' && currentReport) ? <PreviewData currentReport={currentReport} currentReportData={currentReportData} getReportData={getReportData} id={id} /> : currentView == 'Create Job' ? <CreateJob currentReport={currentReport} /> :
        currentView == 'Job Logs' ? <div>Job Logs</div> : currentView == 'Jobs' ? <Jobs currentReport={currentReport} /> : <VscLoading className='animate-spin text-6xl' />}
        {/* <PreviewData currentReport={currentReport} currentReportData={currentReportData} getReportData={getReportData} id={id} /> */}
    </div>
  )
}
