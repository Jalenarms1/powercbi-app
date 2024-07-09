import React from 'react'
import { DataTable } from './DataTable'
import { VscLoading } from 'react-icons/vsc'

export const DataSheet = ({currentSheet, dataErr, viewData, currentSheetData, dataLoading, handleGetData, setSelectedValue, filters, sortList, setFilters, setSortList }) => {




  return (
    <>
        {currentSheetData && (
            <div style={{ height: '80vh' }}>
                
                <DataTable viewData={viewData} columns={currentSheet?.columnList.split(",")} data={currentSheetData} setSelectedValue={setSelectedValue} filters={filters} sortList={sortList} setFilters={setFilters} setSortList={setSortList} />
                
            </div>
            
        )}
        {(!currentSheetData) && <div className="h-96 w-full flex justify-center items-center shadow-sm shadow-zinc-400 pb-10">
            {(!dataLoading) && <button onClick={() => handleGetData(currentSheet)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Get Data</button>}

            {(dataLoading) && !dataErr && <VscLoading className='animate-spin text-6xl' />}

            {dataErr && <p className='text-red-500 text-xl'>There was an error retrieving the data. Please check your configuration.</p>}

        </div>}
        {currentSheetData && <div className='flex justify-end p-2'>
            <p className='font-semibold text-lg'>Count: <span className='font-normal'>{viewData?.length}</span></p>
        </div>}
    
    </>
  )
}
