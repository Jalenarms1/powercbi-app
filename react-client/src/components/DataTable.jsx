import React, { useEffect, useState } from 'react'
import { FaLongArrowAltUp } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
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
            if (filters.length > 0) {
                let currData = data
                filters.forEach(f => {
                    currData = [...currData].filter(d => {
                        return !f.values.includes(d[f.column])
                    })
                })
    
                setData(currData)
            }

            if(sortList.length > 0) {

                let currData = data;
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
    
                setData(currData)
            }else {
                setData(currentReportData)
            }
        }
    }, [sortList, filters])

    useEffect(() => {
        
    }, [sortList, filters])

  return (
    <div className="overflow-x-scroll w-[95vw] mx-auto rounded-md shadow-sm shadow-zinc-300 relative">
        {openColumnFilter && <div className="absolute inset-0">
        <div className=" bg-white shadow-md shadow-zinc-400  flex flex-col h-96 overflow-y-scroll z-50">
            {data.map(d => d[openColumnFilter]).map((cv, indx) => (
                <div>
                    <p key={indx} onClick={() => toggleFilter(openColumnFilter, cv)} className='text-black'>{cv}</p>
                </div>
            ))}
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
