import React, { useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { DataTable } from './DataTable';


export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [dataLoading, setDataLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState()


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

    console.log('currentReportData', currentReportData)

  return (
    <div className='  rounded-md flex flex-col flex-1 gap-4 p-2  overflow-x-hidden'>
        <div className='flex justify-between '>
            <p className='text-xl'>Preview Data</p>
            <div className="flex items-end gap-4">
                {selectedValue && <p className=''>Value: <span className='bg-white p-1 rounded-md shadow-sm shadow-zinc-400 w-64 ml-1'>{selectedValue}</span></p>}
                {(!dataLoading && currentReportData) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Refresh</button>}

            </div>

        </div>
        {currentReportData && (
            // <div className="w-3/4  ">
            //     <MUIDataTable
            //         title={''}
            //         data={currentReportData}
            //         columns={currentReport.columnList.split(",")}
            //         options={options}
            //     />
            // </div>
            <div className=" bg-zinc-100 rounded">
                <DataTable currentReport={currentReport} currentReportData={currentReportData} setSelectedValue={setSelectedValue} />

            </div>
        )}
        {(!currentReportData) && <div className="h-96 w-full flex justify-center items-center shadow-sm shadow-zinc-400 pb-10">
            {(!dataLoading) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Run report</button>}

            {(dataLoading) && <VscLoading className='animate-spin text-6xl' />}

        </div>}
    </div>
  )
}
