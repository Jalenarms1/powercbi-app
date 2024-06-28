import React, { useEffect, useState } from 'react'
import { FaCheck, FaLongArrowAltUp } from "react-icons/fa";
import { IoCheckmark, IoFilter } from "react-icons/io5";
import { FaLongArrowAltDown } from "react-icons/fa";


export const DataTable = ({currentReport, currentReportData, setSelectedValue}) => {

    const [dataColumns, setDataColumns] = useState(null)
    const [data, setData] = useState(null)
    const [sortList, setSortList] = useState([])
    const [filters, setFilters] = useState([])
    const [openColumnFilter, setOpenColumnFilter] = useState(null)


    useEffect(() => {
        setData(currentReportData)
    }, [currentReportData])

    useEffect(() => {
        setDataColumns(currentReport?.columnList.split(","))
    }, [currentReport])

    const toggleFilter = (col, val) => {
        console.log(col);
        console.log(val);
        if (filters.filter(f => f.column == col).length < 1) {
            setFilters([...filters, {column:col, values: [val]}])
        } else {
            

            if(filters.find(f => f.column == col).values.includes(val)) {
                if(filters.find(f => f.column == col).values.length == 1) {
                    setFilters(filters.filter(f => f.column != col))
                } else {
                    setFilters(() => {
                        return filters.map(f => {
                            if (f.column == col) {
                                return {
                                    ...f,
                                    values: f.values.filter(v => v != val)
                                }
                            } else {
                                return f
                            }
                        })
                    })

                }
            } else {
                console.log('adding');
                setFilters(() => {
                    return filters.map(f => {
                        if (f.column == col) {
                            return {
                                ...f,
                                values: [...f.values, val]
                            }
                        } else {
                            return f
                        }
                    })
                })
            }
        } 

        
    }

    const toggleSort = (col) => {
        if (sortList.filter(s => s.column == col).length < 1) {
            setSortList([...sortList, {column: col, sort: 'asc'}])
        } else if (sortList.find(s => s.column == col).sort == 'asc') {
            setSortList(() => {
                return sortList.map(i => {
                    if (i.column == col) {
                        return {
                            ...i,
                            sort: 'desc'
                        }
                    } else {
                        return i
                    }
                })
            })
        } else if (sortList.find(s => s.column == col).sort == 'desc') {
            setSortList(sortList.filter(i => i.column != col))
        }
    }

    useEffect(() => {
        if (currentReportData) {
            let currData = currentReportData
            if (filters.length > 0) {
                filters.forEach(f => {
                    currData = [...currData].filter(d => {
                        return !f.values.includes(d[f.column])
                    })
                })
    
            } 

            if(sortList.length > 0) {

                sortList.forEach(s => {
                    currData =  [...currData].sort((a, b) => {
                        let comparison = 0;
                        const valueA = a[s.column];
                        const valueB = b[s.column];
                  
                        // Handle sorting based on data type
                        if (typeof valueA === 'number' && typeof valueB === 'number') {
                          comparison = valueA - valueB;
                        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                          comparison = valueA.localeCompare(valueB);
                        } else if (valueA instanceof Date && valueB instanceof Date) {
                          comparison = valueA.getTime() - valueB.getTime();
                        } else {
                          // Handle other data types or mixed types as needed
                          comparison = String(valueA).localeCompare(String(valueB));
                        }
                  
                        // Adjust comparison based on sort direction
                        return s.sort === 'asc' ? comparison : -comparison;
                    });
                }) 
            }
            setData(currData)
            
        }
    }, [sortList, filters, currentReport])

    

    console.log(filters);
    console.log(data)

  return (
    <div className="overflow-x-scroll w-[95vw] mx-auto rounded-md shadow-sm shadow-zinc-300 relative">
        {openColumnFilter && <div className="fixed inset-0 z-[1] w-full bg-opacity-60">
            <div className=" bg-white shadow-md rounded-md shadow-zinc-400  flex flex-col h-96 mt-28 overflow-y-scroll w-1/2 mx-auto relative">
                <div className='border-b bg-slate-900 text-white flex justify-between p-2 sticky top-0'>
                    <p className='text-2xl font-semibold'>{openColumnFilter}</p>
                    <button onClick={() => setOpenColumnFilter(null)} className='p-1 border hover:bg-slate-800  rounded-md'>Close</button>
                </div>
                <div className='flex items-center justify-between cursor-pointer p-2 hover:bg-zinc-100'>
                    <p>Check all</p>
                    <button className={` shadow-sm shadow-zinc-300 ${data.map(d => d[openColumnFilter]).length == currentReportData.map(d=> d[openColumnFilter]).length ? 'bg-blue-500' : 'bg-white'} `}>
                        <IoCheckmark className='text-white font-semibold' />
                    </button>
                </div>
                <div className="flex flex-col">
                    {currentReportData.map(d => d[openColumnFilter]).map((cv, indx) => (
                        <div onClick={() => toggleFilter(openColumnFilter, cv)} key={indx} className='flex items-center justify-between cursor-pointer p-2 hover:bg-zinc-100'>
                            <p  onClick={() => toggleFilter(openColumnFilter, cv)} className='text-black'>{cv}</p>
                            <button className={` shadow-sm shadow-zinc-300 ${data.filter(d => d[openColumnFilter] == cv).length > 0 ? 'bg-blue-500' : 'bg-white'} `}>
                                <IoCheckmark className='text-white font-semibold' />
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </div>}
        {data && <div className='bg-zinc-100 rounded-md flex flex-col w-fit relative '>
            
            <div id="table-header" className='flex bg-slate-900 text-white sticky top-0'>
                {dataColumns.map((c, i) => (
                    <div className='w-[300px] p-3 flex justify-between items-center '>
                        <div className="flex items-center gap-2">
                            <p onClick={() => toggleSort(c)} className='cursor-pointer' key={i} >{c}</p>
                            {sortList.find(s => s.column == c)?.sort == 'asc' && <FaLongArrowAltUp />}
                            {sortList.find(s => s.column == c)?.sort == 'desc' &&<FaLongArrowAltDown />}
                        </div>
                        <IoFilter onClick={openColumnFilter == c ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(c)} className='cursor-pointer scale-[.95]' />
                        
                    </div>
                ))}

            </div>
            
            <div className='flex flex-col'>
                {data.map((d, i) => (
                    <div className={`flex ${i % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} `}>
                        {dataColumns.map((c, i) => (
                            <p onClick={() => setSelectedValue(d[c])} className='w-[300px] p-3  truncate cursor-pointer hover:shadow-inner'>{d[c]}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>}
    </div>
  )
}
