import React, { useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { DataTable } from './DataTable';
import MUIDataTable from 'mui-datatables'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import { formatDateIfDate } from '../utils';
import DataTableV2 from './DataTableV2';
import { VirtualizedTable } from './VirtualizedTable';
import { DataSheet } from './DataSheet';
import Dropdown from './Dropdown';
import { useReportContext } from '../context/ReportContext';
import { CiSettings } from "react-icons/ci";
import { IoMdRefresh } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { useAuth } from '../context/AuthContext';
import { SheetSettings } from './SheetSettings';




export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [dataLoading, setDataLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)
    const {getSheetData, currentSheetData, currentSheet, handleSetSheet, addSheet} = useReportContext()
    const [showSheetSettings, setShowSheetSettings] = useState(false)
    const [editSheetTitle, setEditSheetTitle] = useState(false)
    const [newTitle, setNewTitle] = useState(null)
    const {user} = useAuth()
    

    const handleGetData = (currentSheet) => {
        setDataLoading(true)
        getSheetData(currentSheet)
    }


    useEffect(() => {
        if(currentSheetData) {
            setDataLoading(false)
        }
    }, [currentSheetData])

    
    useEffect(() => {
        if(currentReport) {
            // handleSetSheet(currentReport.sheets[0])
        }
    }, [currentReport])

    useEffect(() => {
        if(currentSheet) {
            // handleGetData(currentSheet)
        }
    }, [currentSheet])
    

    const sheetOpts = (sheetArr) => {
        return sheetArr.map((s) => {
            return {
                ...s,
                name: s.sheetTitle
            }
        })
    }

    console.log('dataLoading', dataLoading);
    console.log('currentSheetData', currentSheetData);

  return (
    <div className='  rounded-md flex flex-col flex-1 gap-4 p-2  overflow-x-hidden'>
        {/* {currentReport?.sheets.map()} */}
        <div className='flex justify-between bg-zinc-100 shadow-md shadow-zinc-200 p-2'>
            <div className="flex gap-2 items-center cursor-pointer">
                {(currentSheet && !editSheetTitle) ? <p className='text-xl'>{currentSheet.sheetTitle}</p> : <input type='text' className='p-1' onChange={(e) => setNewTitle(e.target.value)} />}
                { !editSheetTitle ? <CiEdit className='text-2xl' /> : <button className='p-1 bg-blue-400 text-white'>Save</button>}
            </div>
            {!showSheetSettings ? <div className="flex items-end gap-2">
                {selectedValue && <p className=''>Value: <span className='bg-white p-1 rounded-md shadow-sm shadow-zinc-400 w-64 ml-1'>{selectedValue}</span></p>}
                {(!dataLoading && currentSheetData) && <IoMdRefresh title='Refresh' onClick={() => handleGetData(currentSheet)} className='bg-zinc-200 cursor-pointer shadow-sm shadow-zinc-300 text-3xl active:scale-[.95]' />}
                <CiSettings onClick={() => setShowSheetSettings(true)} title='Settings' className='bg-zinc-200 text-black shadow-sm shadow-zinc-300 text-3xl active:scale-[.95] cursor-pointer' />
            </div> : 
            <div className="flex items-end gap-2">
                <button onClick={() => setShowSheetSettings(false)} title='Settings' className='bg-zinc-200 text-black shadow-sm shadow-zinc-300 active:scale-[.95] p-1 rounded-sm'>Back</button>
            </div>}

        </div>
        {currentReport && <div className="w-full flex justify-end">
            <div className="flex gap-2 items-end">
                <p>Sheet:</p>
                <Dropdown label={currentReport.sheets[0].sheetTitle} options={sheetOpts(currentReport.sheets)} onSelect={(option) => handleSetSheet(option)} />
                <button onClick={() => addSheet(currentSheet)} className='px-3 py-1 bg-blue-500 text-white rounded-md active:scale-[.95] active:shadow-sm active:shadow-zinc-700'>+ Add sheet</button>
            </div>

        </div>}
        {!showSheetSettings ? <DataSheet setSelectedValue={setSelectedValue} currentSheet={currentSheet} currentSheetData={currentSheetData} handleGetData={handleGetData} dataLoading={dataLoading}  /> : <SheetSettings currentSheet={currentSheet}  />}
    </div>
  )
}
