import React, { useEffect, useState } from 'react'
import { DataSheet } from './DataSheet';
import Dropdown from './Dropdown';
import { useReportContext } from '../context/ReportContext';
import { CiSettings } from "react-icons/ci";
import { IoMdRefresh } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { useAuth } from '../context/AuthContext';
import { SheetSettings } from './SheetSettings';

import { FaCheckDouble } from "react-icons/fa6";
import { getFilterColsFromStr, getFiltersStr, getSortListStr, getSortsFromStr } from '../utils';





export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [dataLoading, setDataLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)
    const {getSheetData, currentSheetData, currentSheet, handleSetSheet, dataErr, addSheet, updateSheet, filters, setFilters, sortList, setSortList, viewData} = useReportContext()
    // const [filters, setFilters] = useState([])
    // const [sortList, setSortList] = useState([])
    const [showSheetSettings, setShowSheetSettings] = useState(false)
    const [editSheetTitle, setEditSheetTitle] = useState(false)
    const [newTitle, setNewTitle] = useState(currentSheet?.sheetTitle ?? null)
    const [saveFiltersBtn, setSaveFiltersBtn] = useState(false)
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
        if(filters, sortList) {
            setSaveFiltersBtn(true)
        }
    }, [filters, sortList])

    
    useEffect(() => {
        if(currentReport) {
            // handleSetSheet(currentReport.sheets[0])
            setNewTitle(null)
        }
    }, [currentReport])

    useEffect(() => {
        if(currentSheet) {
            // handleGetData(currentSheet)
            setNewTitle(null)
            setSaveFiltersBtn(false)

            // if(currentSheet.filters) {
            //     setFilters(getFilterColsFromStr(currentSheet.filters))
            // }

            // if(currentSheet.orderBy) {
            //     setSortList(getSortsFromStr(currentSheet.orderBy))
            // }
        }
    }, [currentSheet])
    

    const sheetOpts = (sheetArr) => {
        return sheetArr.map((s) => {
            return {
                ...s,
                uid: s.uid,
                name: s.sheetTitle
            }
        })
    }
    

    const handleSaveFilters = () => {

        // let filtersArr = []
        // filters.forEach(f => {
        //     let colStr = `${f.name}=${f.values.join(",")}`

        //     filtersArr.push(colStr)

            

        // })

        // let sortListArr = []
        // sortList.forEach(s => {
            
        //     let sortStr = `${s.name}=${s.sort}`

        //     sortListArr.push(sortStr)
        // })

        const updObj = {}

        if(filters.length > 0) {
            // updObj.filters = filtersArr.join("|")
            updObj.filters = getFiltersStr(filters)
        } else {
            updObj.filters = ''
        }

        if(sortList.length > 0) {
            // updObj.orderBy = sortListArr.join("|")
            updObj.orderBy = getSortListStr(sortList)
        } else {
            updObj.orderBy = ''
        }

        if(Object.keys(updObj).length > 0) {
            updateSheet(updObj, currentSheet.uid, currentReport.uid)

            setSaveFiltersBtn(false)

        } 

        getSheetData(currentSheet)

    }

    const handleUpdateTitle = () => {
        updateSheet({title: newTitle}, currentSheet.uid, currentReport.uid)
        setNewTitle(null)
    }

    

  return (
    <div className='  rounded-md flex flex-col flex-1 gap-4 p-2  overflow-x-hidden'>
        {/* {currentReport?.sheets.map()} */}
        <div className='flex justify-between bg-zinc-100 shadow-md shadow-zinc-200 p-2'>
            <div className="flex gap-2 items-center cursor-pointer">
                {(currentSheet && !newTitle) ? <p className='text-xl'>{currentSheet.sheetTitle}</p> : <input max={200} type='text' className='p-1' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />}
                { !newTitle ? <CiEdit onClick={() => setNewTitle(currentSheet?.sheetTitle)} className='text-2xl active:scale-[.95]' /> : <FaCheckDouble onClick={handleUpdateTitle}  className='p-1 bg-blue-400 text-white text-3xl rounded-sm active:scale-[.95]' />}
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
                <Dropdown currentOptId={currentSheet?.uid} label={currentSheet?.sheetTitle ?? currentReport?.sheets[0].sheetTitle} options={sheetOpts(currentReport.sheets)} onSelect={(option) => handleSetSheet(option)} />
                <button onClick={() => addSheet(currentSheet)} className='px-3 py-1 bg-blue-500 text-white rounded-md active:scale-[.95] active:shadow-sm active:shadow-zinc-700'>+ Add sheet</button>
                {!showSheetSettings && <button disabled={!saveFiltersBtn} onClick={handleSaveFilters} className={`px-3 py-1  ${saveFiltersBtn ? 'bg-green-500 text-white' : 'bg-zinc-400 text-zinc-300'}  rounded-md active:scale-[.95] active:shadow-sm active:shadow-zinc-700`}>Save filters</button>}
            </div>

        </div>}
        {!showSheetSettings ? <DataSheet dataErr={dataErr} viewData={viewData} filters={filters} sortList={sortList} setFilters={setFilters} setSortList={setSortList} setSelectedValue={setSelectedValue} currentSheet={currentSheet} currentSheetData={currentSheetData} handleGetData={handleGetData} dataLoading={dataLoading}  /> : <SheetSettings redirectToDataView={() => setShowSheetSettings(false)} updateSheet={updateSheet} currentSheet={currentSheet} currentReport={currentReport}  />}
    </div>
  )
}
