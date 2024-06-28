import React, { useEffect, useState } from 'react'
import { FaCheck, FaLongArrowAltUp } from "react-icons/fa";
import { IoCheckmark, IoFilter } from "react-icons/io5";
import { FaLongArrowAltDown } from "react-icons/fa";
import { DataFilter } from './Modals/DataFilter';
import { formatDateIfDate } from '../utils';


export const DataTable = ({currentReport, currentReportData, setSelectedValue}) => {

    const [dataColumns, setDataColumns] = useState(null)
    const [data, setData] = useState(null)
    const [sortList, setSortList] = useState([])
    const [filters, setFilters] = useState([])
    const [openColumnFilter, setOpenColumnFilter] = useState(null)
    const [checkAll, setCheckAll] = useState(true)


    useEffect(() => {
        setData(currentReportData)
    }, [currentReportData])

    useEffect(() => {
        setDataColumns(currentReport?.columnList.split(","))
    }, [currentReport])

    

    useEffect(() => {
        if(checkAll) {
            setFilters(filters.filter(f => f.column != openColumnFilter))
        } else {
            if(currentReport && currentReportData) {
                let filterArr = []
                currentReport?.columnList.split(",").forEach(c => {
                    let obj = {}
                    obj['column'] = c
                    obj['values'] = []
                    currentReportData?.forEach(d => {
                        if (!obj['values'].includes(d[c])) {
                            obj['values'] = [...obj['values'], d[c]]

                        }
                    })
                    filterArr = [...filterArr, obj]

                })
                console.log('filterArr', filterArr);
                setFilters(filterArr)

            }
        }
    }, [checkAll])

    

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
                                console.log('logging ' + col + val, {
                                    ...f,
                                    values: f.values.filter(v => v != val)
                                });
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
    <div className=" w-[97vw] h-[95vh] overflow-auto  rounded-md shadow-sm shadow-zinc-300 relative">
        {openColumnFilter && <DataFilter checkAll={checkAll} setCheckAll={setCheckAll} currentReportData={currentReportData} data={data} openColumnFilter={openColumnFilter} toggleFilter={toggleFilter} setOpenColumnFilter={setOpenColumnFilter}  />}
        {data && <div className='bg-zinc-100 rounded-md flex flex-col w-fit relative '>
            
            <div id="table-header" className='flex bg-slate-900 text-white sticky top-0'>
                {dataColumns.map((c, i) => (
                    <div className='w-[300px] p-3 flex justify-between items-center '>
                        <div className="flex items-center gap-2">
                            <p onClick={() => toggleSort(c)} className='cursor-pointer' key={i} >{c}</p>
                            {sortList.find(s => s.column == c)?.sort == 'asc' && <FaLongArrowAltUp />}
                            {sortList.find(s => s.column == c)?.sort == 'desc' &&<FaLongArrowAltDown />}
                        </div>
                        <IoFilter onClick={openColumnFilter == c ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(c)} className={`cursor-pointer ${ filters.filter(f => f.column == c).length > 0 ? 'text-green-500' : ''} scale-[.95]`} />
                        
                    </div>
                ))}

            </div>
            
            <div className='flex flex-col'>
                {data.map((d, i) => (
                    <div className={`flex ${i % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} `}>
                        {dataColumns.map((c, i) => (
                            <p onClick={() => setSelectedValue(d[c])} className='w-[300px] p-3  truncate cursor-pointer hover:shadow-inner'>{formatDateIfDate(d[c])}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>}
    </div>
  )
}
