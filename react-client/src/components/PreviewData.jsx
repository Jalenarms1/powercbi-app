import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'

export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [dataLoading, setDataLoading] = useState(false)

    const handleGetData = (dataSource, dataSourceType, columnList) => {
        setDataLoading(true)
        getReportData(dataSource, dataSourceType, columnList)
    }

    useEffect(() => {
        if(currentReportData) {
            setDataLoading(false)
        }
    }, [currentReportData])

    const options = {
        selectableRows: false,
        downloadOptions: {
            filename: `${currentReport?.title}.csv`
        }
    }

  return (
    <div className='  rounded-md flex flex-col gap-4 p-2 max-h-[70vh] overflow-y-scroll '>
        <div className='flex justify-between pr-2'>
            <p className='text-xl'>Preview Data</p>
            {(!dataLoading && currentReportData) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Refresh</button>}

        </div>
        {currentReportData && (
            <div className="h-[50vh]  ">
                <MUIDataTable
                    title={''}
                    data={currentReportData}
                    columns={currentReport.columnList.split(",")}
                    options={options}
                />
            </div>
        )}
        {(!currentReportData && !dataLoading) && <div className="h-96 w-full flex justify-center items-center shadow-sm shadow-zinc-400 pb-10">
            {(!dataLoading && !currentReportData) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Run report</button>}

            {(!currentReportData && dataLoading) && <VscLoading className='animate-spin text-6xl' />}

        </div>}
    </div>
  )
}
