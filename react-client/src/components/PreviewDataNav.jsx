import React, { useState } from 'react'
import { CiEdit, CiSettings } from 'react-icons/ci'
import { FaCheckDouble } from 'react-icons/fa'
import { GoTrash } from 'react-icons/go'
import { IoMdRefresh } from 'react-icons/io'

export const PreviewDataNav = ({currentSheet, refreshSheet, updateSheet, currentReport, selectedValue, showSheetSettings, currentSheetData, dataLoading, handleGetData, removeSheet, setShowSheetSettings}) => {
    const [newTitle, setNewTitle] = useState(null)
    const [confirmRem, setConfirmRem] = useState(false)

    const handleUpdateTitle = (title) => {
        updateSheet({title: title.trim()}, currentSheet.uid, currentReport.uid)
        setNewTitle(null)
    }

  return (
    <div className='flex justify-between bg-zinc-100 shadow-md shadow-zinc-200 p-2'>
        <div className="flex gap-2 items-center cursor-pointer">
            {(currentSheet && !newTitle) ? <p className='text-xl'>{currentSheet.sheetTitle}</p> : <input max={200} type='text' className='p-1' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />}
            { !newTitle ? <CiEdit onClick={() => setNewTitle(currentSheet?.sheetTitle)} className='text-2xl active:scale-[.95]' /> : <FaCheckDouble onClick={() => handleUpdateTitle(newTitle)}  className='p-1 bg-blue-400 text-white text-3xl rounded-sm active:scale-[.95]' />}
        </div>
        {!showSheetSettings ? <div className="flex items-end gap-2">
            {selectedValue && <p className=''>Value: <span className='bg-white p-1 rounded-md shadow-sm shadow-zinc-400 w-64 ml-1'>{selectedValue}</span></p>}
            {(!dataLoading && currentSheetData) && <IoMdRefresh title='Refresh' onClick={() => refreshSheet(currentSheet)} className='bg-zinc-200 cursor-pointer shadow-sm shadow-zinc-300 text-3xl active:scale-[.95]' />}
            <CiSettings onClick={() => setShowSheetSettings(true)} title='Settings' className='bg-zinc-200 text-black shadow-sm shadow-zinc-300 text-3xl active:scale-[.95] cursor-pointer rounded-sm' />
            {currentReport.sheets.length > 1 && <div>
                {!confirmRem ? <GoTrash onClick={() => setConfirmRem(true)} className={`bg-zinc-200 text-red-500 shadow-sm shadow-zinc-300 text-3xl active:scale-[.95] cursor-pointer rounded-sm`} /> : <GoTrash onClick={() => removeSheet(currentSheet.uid)} className='bg-red-500 text-white shadow text-3xl active:scale-[.95] cursor-pointer rounded-sm' />}

            </div>}
        </div> : 
        <div className="flex items-end gap-2">
            <button onClick={() => setShowSheetSettings(false)} title='Settings' className='bg-zinc-200 text-black shadow-sm shadow-zinc-300 active:scale-[.95] p-1 rounded-sm'>Back</button>
        </div>}

    </div>
  )
}
