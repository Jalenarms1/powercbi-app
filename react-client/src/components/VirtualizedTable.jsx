import React, { useEffect, useRef, useState } from 'react'
import { formatDateIfDate } from '../utils';
import { DataFilter } from './Modals/DataFilter';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import AutoSizer from 'react-virtualized-auto-sizer';
import {FixedSizeList as List} from 'react-window'

export const VirtualizedTable = ({data, columns, setSelectedValue}) => {

    const [currData, setCurrData] = useState([]);
    const [sortList, setSortList] = useState([]);
    const [openColumnFilter, setOpenColumnFilter] = useState(false);
    const [filters, setFilters] = useState([]);
    const [scrollTop, setScrollTop] = useState(0)
    const [visibleRows ,setVisibleRows] = useState([])
    const scrollRef = useRef()

   

    useEffect(() => {
        if (data) {
            setCurrData(data);
        }
    }, [data]);

  

    const toggleSort = (col) => {
        const existingSort = sortList.find((s) => s.name === col);
        if (existingSort) {
            const newSort = existingSort.sort === 'asc' ? 'desc' : null;
            setSortList(newSort ? [...sortList.filter((s) => s.name !== col), { name: col, sort: newSort }] : sortList.filter((s) => s.name !== col));
        } else {
            setSortList([...sortList, { name: col, sort: 'asc' }]);
        }
    };

    const toggleFilter = (col, val) => {
        const existingFilter = filters.find((f) => f.name === col);
        if (existingFilter) {
            const newValues = existingFilter.values.includes(val)
                ? existingFilter.values.filter((v) => v !== val)
                : [...existingFilter.values, val];
            setFilters(newValues.length ? [...filters.filter((f) => f.name !== col), { name: col, values: newValues }] : filters.filter((f) => f.name !== col));
        } else {
            setFilters([...filters, { name: col, values: [val] }]);
        }
    };

    const clearColFilter = (col) => {
        setFilters(filters.filter((f) => f.name !== col));
    };

    const sortData = (data) => {
        let sortedData = data;
        sortList.forEach((sort) => {
            sortedData = [...sortedData].sort((a, b) => {
                let comparison = 0;
                const valueA = a[sort.name];
                const valueB = b[sort.name];

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    comparison = valueA - valueB;
                } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                    comparison = valueA.localeCompare(valueB);
                } else if (valueA instanceof Date && valueB instanceof Date) {
                    comparison = valueA.getTime() - valueB.getTime();
                } else {
                    comparison = String(valueA).localeCompare(String(valueB));
                }

                return sort.sort === 'asc' ? comparison : -comparison;
            });
        });
        return sortedData;
    };

    const filterData = (data) => {
        let filteredData = data;
        filters.forEach((filter) => {
            filteredData = filteredData.filter((item) => filter.values.includes(item[filter.name]));
        });
        return filteredData;
    };

    useEffect(() => {
        let updatedData = data;
        if (filters.length > 0) {
            updatedData = filterData(updatedData);
        }
        if (sortList.length > 0) {
            updatedData = sortData(updatedData);
        }
        setCurrData(updatedData);
    }, [filters, sortList, data]);

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const rowData = currData[rowIndex];
        const col = columns[columnIndex];
        const cellValue = rowData[col];
        return (
            <div key={key} style={style} className="cell w-[300px]">
                {(['true', 'false'].includes(`${cellValue}`) && !['true', 'false'].includes(cellValue)) ? `${cellValue}` : formatDateIfDate(cellValue)}
            </div>
        );
    };

   
    
    
    
    
  return (
    <div ref={scrollRef} className=" w-full h-[95vh] overflow-hidden overflow-x-auto  rounded-md shadow-sm shadow-zinc-300 relative">
        {openColumnFilter && <DataFilter filters={filters} sortList={sortList} clearColFilter={clearColFilter}  data={data} openColumnFilter={openColumnFilter} toggleFilter={toggleFilter} setOpenColumnFilter={setOpenColumnFilter}  />}
        {currData && currData.length > 0 &&  <div className='bg-zinc-100 rounded-md flex flex-col w-fit relative '>
            
            <div id="table-header" className='flex bg-slate-900 text-white sticky top-0'>
                {columns.map((c, i) => (
                    <div className='w-[300px] p-3 flex justify-between items-center '>
                        <div className="flex items-center gap-2">
                            <p onClick={() => toggleSort(c)} className='cursor-pointer' key={i} >{c}</p>
                            {sortList.find(s => s.name == c)?.sort == 'asc' && <FaLongArrowAltUp />}
                            {sortList.find(s => s.name == c)?.sort == 'desc' &&<FaLongArrowAltDown />}
                        </div>
                        <IoFilter onClick={openColumnFilter == c ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(c)} className={`cursor-pointer ${ filters.filter(f => f.column == c).length > 0 ? 'text-green-500' : ''} scale-[.95]`} />
                        
                    </div>
                ))}

            </div>
            <div>
            <AutoSizer>
                {({height, width}) => (

                    <List
                        className=''
                        height={1000}
                        itemCount={currData.length}
                        itemSize={50}
                        width={width}
                        
                    >
                        {({index, style}) => (
                            <TableRow style={style} index={index} columns={columns} row={currData[index]}  />
                            // <p>{index}</p>
                        )}
                    </List>

                )}

            </AutoSizer>

            </div>
                {/* {visibleRows.map((d, i) => (
                    <div className={`flex ${i % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} `}>
                        {columns.map((c, i) => (
                            <TableData value={d[c]} setSelectedValue={setSelectedValue} />
                        ))}
                    </div>
                ))} */}
        </div>}
    </div>
  )
  
}

const TableRow = ({value, setSelectedValue,  columns, index, row, style}) => {
    console.log(row);
    return (
        <div style={style} className={`flex ${index % 2 == 0 ? 'bg-zinc-300' : 'bg-zinc-200'} `}>
            {columns.map((c, i) => (
                <p onClick={() => setSelectedValue(row[c])} className='w-[300px] p-3  truncate cursor-pointer hover:shadow-inner'>{formatDateIfDate(row[c])}</p>
            ))}
        </div>
    )
}
