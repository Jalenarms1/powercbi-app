import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { DataGrid } from '@mui/x-data-grid';
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
    <div className='  rounded-md flex flex-col gap-4 p-2 max-h-[99vh]  overflow-x-hidden pr-5'>
        <div className='flex justify-between pr-2'>
            <p className='text-xl'>Preview Data</p>
            <div className="flex items-end gap-4">
                {selectedValue && <p className=''>Value: {selectedValue}</p>}
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
            <DataTable currentReport={currentReport} currentReportData={currentReportData} setSelectedValue={setSelectedValue} />
        )}
        {(!currentReportData) && <div className="h-96 w-full flex justify-center items-center shadow-sm shadow-zinc-400 pb-10">
            {(!dataLoading) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Run report</button>}

            {(dataLoading) && <VscLoading className='animate-spin text-6xl' />}

        </div>}
    </div>
  )
}
