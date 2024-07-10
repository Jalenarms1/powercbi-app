import React, { useEffect, useMemo, useState } from 'react'
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
import { GoTrash } from "react-icons/go";
import { PreviewDataNav } from './PreviewDataNav';






export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [selectedValue, setSelectedValue] = useState(null)
    const {getSheetData, currentSheetData, currentSheet, handleSetSheet, dataErr, addSheet, updateSheet, filters, setFilters, sortList, setSortList, viewData, removeSheet, dataLoading} = useReportContext()
    const [showSheetSettings, setShowSheetSettings] = useState(false)
    const [editSheetTitle, setEditSheetTitle] = useState(false)
    const [newTitle, setNewTitle] = useState(currentSheet?.sheetTitle ?? null)
    const [saveFiltersBtn, setSaveFiltersBtn] = useState(false)
    const {user} = useAuth()
    const [confirmRem, setConfirmRem] = useState(false)
    

    const handleGetData = (currentSheet) => {
        getSheetData(currentSheet)
    }


    // useEffect(() => {
    //     if(currentSheetData) {
    //     }
    // }, [currentSheetData])

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
            setNewTitle(null)
            setSaveFiltersBtn(false)
        }
    }, [currentSheet])


    const sheetOpts = useMemo(() => {
        return currentReport.sheets.map((s) => {
            return {
                ...s,
                uid: s.uid,
                name: s.sheetTitle
            }
        })
    }, [currentReport, currentSheet])
    

    const handleSaveFilters = () => {

        const updObj = {}

        if(filters.length > 0) {
            updObj.filters = getFiltersStr(filters)
        } else {
            updObj.filters = ''
        }

        if(sortList.length > 0) {
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

    const handleUpdateTitle = (title) => {
        updateSheet({title}, currentSheet.uid, currentReport.uid)
        setNewTitle(null)
    }

    const memoDropDown = useMemo(() => {
        
    }, [currentReport])
    

  return (
    <div className='  rounded-md flex flex-col flex-1 gap-4 p-2  overflow-x-hidden'>
        
        <PreviewDataNav currentSheet={currentSheet} currentSheetData={currentSheetData} dataLoading={dataLoading} handleGetData={handleGetData} handleUpdateTitle={handleUpdateTitle} removeSheet={removeSheet} setShowSheetSettings={setShowSheetSettings} showSheetSettings={showSheetSettings} currentReport={currentReport} selectedValue={selectedValue}  />
        {currentReport && <div className="w-full flex justify-end">
            <div className="flex gap-2 items-end">
                <p>Sheet:</p>
                <Dropdown currentOptId={currentSheet?.uid} label={currentSheet?.sheetTitle ?? currentReport?.sheets[0].sheetTitle} options={sheetOpts} onSelect={(option) => handleSetSheet(option)} />
                <button onClick={() => addSheet({...currentSheet, data:null})} className='px-3 py-1 bg-blue-500 text-white rounded-md active:scale-[.95] active:shadow-sm active:shadow-zinc-700'>+ Add sheet</button>
                {!showSheetSettings && <button disabled={!saveFiltersBtn} onClick={handleSaveFilters} className={`px-3 py-1  ${saveFiltersBtn ? 'bg-green-500 text-white' : 'bg-zinc-400 text-zinc-300'}  rounded-md active:scale-[.95] active:shadow-sm active:shadow-zinc-700`}>Save filters</button>}
            </div>

        </div>}
        {!showSheetSettings ? <DataSheet dataErr={dataErr} viewData={viewData} filters={filters} sortList={sortList} setFilters={setFilters} setSortList={setSortList} setSelectedValue={setSelectedValue} currentSheet={currentSheet} currentSheetData={currentSheetData} handleGetData={handleGetData} dataLoading={dataLoading}  /> : <SheetSettings redirectToDataView={() => setShowSheetSettings(false)} updateSheet={updateSheet} currentSheet={currentSheet} currentReport={currentReport}  />}
    </div>
  )
}
