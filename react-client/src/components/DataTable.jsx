import React, { useEffect, useState } from 'react'
import { FaCheck, FaLongArrowAltUp } from "react-icons/fa";
import { IoCheckmark, IoFilter } from "react-icons/io5";
import { FaLongArrowAltDown } from "react-icons/fa";
import { DataFilter } from './Modals/DataFilter';
import { formatDateIfDate } from '../utils';
import VirtualList from './VirtualList';


export const DataTable = ({columns, data, setSelectedValue}) => {

    const [colList, setColList] = useState(null)
    const [currData, setCurrData] = useState(null)
    const [sortList, setSortList] = useState([])
    const [openColumnFilter, setOpenColumnFilter] = useState(false)
    const [filters, setFilters] = useState([])
    const [scrollTop, setScrollTop] = useState(0)

    const [visibleData, setVisibleData] = useState(null)

    const toggleSort = (col) => {
        console.log('toggleSort', col);
        if(sortList?.filter(s => s.name == col).length > 0) {
            if(sortList.find(s => s.name == col).sort == 'asc'){
                setSortList([...sortList.filter(s => s.name != col), {name:col, sort: 'desc'}])
            } else {
                setSortList([...sortList.filter(s => s.name != col)])
            }
        } else {
            setSortList([...sortList, {name:col, sort: 'asc'}])
        }
    }

    const toggleFilter = (col, val) => {
        if(filters.filter(f => f.name == col).length > 0) {
            if(filters.find(f => f.name == col).values.includes(val)) {
                if(filters.find(f => f.name == col).values.length == 1) {
                    setFilters(filters.filter(f => f.name != col))
                } else {
                    setFilters([...filters.filter(f => f.name != col), {name: col, values: [...filters.find(f => f.name == col).values.filter(v => v != val)]}])

                }
            } else {
                setFilters([...filters.filter(f => f.name != col), {name: col, values: [...filters.find(f => f.name == col).values, val]}])
            }
        } else {
            setFilters([...filters, {name: col, values: [val]}])
        }
    }

    const clearColFilter = (col) => {
        setFilters([...filters.filter(f => f.name != col)])
    }
   

    useEffect(() => {
        if(data) {
            setCurrData(data)

        }
    }, [data])

    useEffect(() => {
        if(currData) {
            const startIndex = Math.max(0, Math.floor(scrollTop / 45) - 10);
            const endIndex = Math.min(currData.length - 1, Math.ceil((scrollTop + 500) / 45) + 10);
    
            const newVisibleItems = currData.slice(startIndex, endIndex + 1)
    
            setVisibleData(newVisibleItems);
        }
    }, [scrollTop, currData])

    useEffect(() => {
        if (columns ){
            setColList(columns)

        }
    }, [columns])

    const sortData = (initData) => {
        let cData = initData
        sortList.forEach(s => {
            cData =  [...currData].sort((a, b) => {
                let comparison = 0;
                const valueA = a[s.name];
                const valueB = b[s.name];
            
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
        return cData
    }

    const filterData = (initData) => {
        let cData = initData

        filters.forEach(f => {
            cData = [...cData].filter(d => {
                console.log(f.name);
                console.log(d[f.name]);
                console.log(f.values);
                return f.values.includes(d[f.name])
            })
        })

        return cData
    }

    // useEffect(() => {
    //     if(sortList?.length > 0) {
    //         let cData = []
    //         cData = sortData(data)

    //         cData = filterData(cData)
    //         setCurrData(cData)
    //     } else {
    //         if(filters.length == 0) {

    //             setCurrData(data)
    //         }
    //     }
    // }, [sortList])

    useEffect(() => {
        if(currData) {
            let cData = data
            if (filters.length > 0) {
                filters.forEach(f => {
                    cData = [...cData].filter(d => {
                        return f.values.includes(d[f.name])
                    })
                })
    
            } 

            if(sortList.length > 0) {

                sortList.forEach(s => {
                    cData =  [...cData].sort((a, b) => {
                        let comparison = 0;
                        const valueA = a[s.name];
                        const valueB = b[s.name];
                  
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
            setCurrData(cData)

        }
    }, [filters, sortList])

    const handleScroll = (e) => {
        const newScrollTop = e.currentTarget.scrollTop
        setScrollTop(newScrollTop)
    }

    console.log('filters', filters);

    const renderItem = (item, index) => (
        <div className={`flex ${index % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} min-w-[400px]`}>
            {colList.map((c, i) => (
                <p onClick={() => setSelectedValue(item[c])} className='w-[400px] p-3  truncate cursor-pointer hover:shadow-inner'>{(['true', 'false'].includes(`${item[c]}`) && !['true', 'false'].includes(item[c])) ?`${item[c]}` : formatDateIfDate(item[c])}</p>
            ))}
        </div>
    );

    const renderCols = () => (
        <div id="table-header" className='flex bg-slate-900 text-white sticky top-0'>
            {colList.map((c, i) => (
                <div className='min-w-[400px] p-3 flex justify-between items-center '>
                    <div className="flex items-center gap-2">
                        <p onClick={() => toggleSort(c)} className='cursor-pointer' key={i} >{c}</p>
                        {sortList?.find(s => s.name == c)?.sort == 'asc' && <FaLongArrowAltUp />}
                        {sortList?.find(s => s.name == c)?.sort == 'desc' &&<FaLongArrowAltDown />}
                    </div>
                    <IoFilter onClick={openColumnFilter == c ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(c)} className={`cursor-pointer ${ filters?.filter(f => f.name == c).length > 0 ? 'text-green-500' : ''} scale-[.95]`} />
                    
                </div>
            ))}

        </div>
    )
    

  return (
    <div onScroll={handleScroll} className=" w-full h-[95vh] overflow-auto  rounded-md shadow-sm shadow-zinc-300 relative">
        {openColumnFilter && <DataFilter clearColFilter={clearColFilter} filters={filters} data={data} openColumnFilter={openColumnFilter} toggleFilter={toggleFilter} setOpenColumnFilter={setOpenColumnFilter}  />}
        {currData && <div className='bg-zinc-100 rounded-md flex flex-col w-fit relative '>
            
            <div id="table-header" className='flex bg-slate-900 text-white sticky top-0'>
                {colList.map((c, i) => (
                    <div className='min-w-[400px] p-2 flex justify-between items-center '>
                        <div className="flex items-center gap-2 hover:bg-slate-800 rounded-md p-1">
                            <p onClick={() => toggleSort(c)} className='cursor-pointer' key={i} >{c}</p>
                            {sortList?.find(s => s.name == c)?.sort == 'asc' && <FaLongArrowAltUp />}
                            {sortList?.find(s => s.name == c)?.sort == 'desc' &&<FaLongArrowAltDown />}
                        </div>
                        <IoFilter onClick={openColumnFilter == c ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(c)} className={`cursor-pointer ${ filters?.filter(f => f.name == c).length > 0 ? 'text-green-500' : ''} scale-[.95]`} />
                        
                    </div>
                ))}

            </div>
            
            {/* <div className={`flex flex-col h-[${45 * currData.length}px]`}>
                {visibleData.map((d, i) => (
                    <div className={`flex ${i % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} `}>
                        {colList.map((c, i) => (
                            <p onClick={() => setSelectedValue(d[c])} className='w-[300px] p-3  truncate cursor-pointer hover:shadow-inner'>{(['true', 'false'].includes(`${d[c]}`) && !['true', 'false'].includes(d[c])) ?`${d[c]}` : formatDateIfDate(d[c])}</p>
                        ))}
                    </div>
                ))}
            </div> */}
            <VirtualList renderCols={renderCols} items={currData} itemHeight={50} renderItem={renderItem} />
        </div>}
    </div>
  )
}
