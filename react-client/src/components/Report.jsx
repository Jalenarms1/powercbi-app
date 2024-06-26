import React, { useEffect } from 'react'
import { useReportContext } from '../context/ReportContext'
import { Link, useParams } from 'react-router-dom'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import MUIDataTable from "mui-datatables";
import { useContainerContext } from '../context/ContainerContext';


export const Report = () => {

    const {id} = useParams()
    const {currentReport, getReport} = useReportContext()
    const {currentContainer, getContainer} = useContainerContext()

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

    const options = {
        selectableRows: false,
        downloadOptions: {
            filename: `${currentReport?.title}.csv`
        }
    }

  return (
    <div className='flex flex-col p-3 w-full gap-4 overflow-y-hidden'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <div className="flex flex-col gap-2">
                {currentReport && <p className="text-3xl text-black font-semibold">{currentReport.title}</p>}
                {currentContainer && <Link to={`/container/${currentContainer.uid}`} className="text-xl text-zinc-400 hover:underline hover:text-zinc-300">{currentContainer.label}</Link>}

            </div>

            {/* <AiTwotoneFolderAdd title='Add new report' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' /> */}
        </div>
        <div className='h-[70vh] overflow-y-scroll pb-10  rounded-md flex flex-col gap-4 p-2'>
            <div>
                <p className='text-xl'>Preview Data</p>
            </div>
            {currentReport && <MUIDataTable 
                title={''}
                data={currentReport.data}
                columns={currentReport.columnList.split(",")}
                options={options} 
            />}
        </div>
    </div>
  )
}
