import React, { useEffect, useState } from 'react';
import { FaCheck, FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import { DataFilter } from './Modals/DataFilter';
import { formatDateIfDate } from '../utils';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

export const DataTable = ({ columns, data, setSelectedValue }) => {
    const [currData, setCurrData] = useState([]);
    const [sortList, setSortList] = useState([]);
    const [openColumnFilter, setOpenColumnFilter] = useState(false);
    const [filters, setFilters] = useState([]);

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
            <div key={key} style={style} className="cell">
                {(['true', 'false'].includes(`${cellValue}`) && !['true', 'false'].includes(cellValue)) ? `${cellValue}` : formatDateIfDate(cellValue)}
            </div>
        );
    };


    return (
        <div className="w-full h-[95vh] overflow-auto rounded-md shadow-sm shadow-zinc-300 relative">
            {openColumnFilter && (
                <DataFilter
                    clearColFilter={clearColFilter}
                    filters={filters}
                    data={data}
                    openColumnFilter={openColumnFilter}
                    toggleFilter={toggleFilter}
                    setOpenColumnFilter={setOpenColumnFilter}
                />
            )}
            {currData && (
                <div className="bg-zinc-100 rounded-md flex flex-col w-fit relative">
                    <div id="table-header" className="flex bg-slate-900 text-white sticky top-0">
                        {columns.map((col, index) => (
                            <div key={index} className="w-[300px] p-3 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p onClick={() => toggleSort(col)} className="cursor-pointer">
                                        {col}
                                    </p>
                                    {sortList.find((s) => s.name === col)?.sort === 'asc' && <FaLongArrowAltUp />}
                                    {sortList.find((s) => s.name === col)?.sort === 'desc' && <FaLongArrowAltDown />}
                                </div>
                                <IoFilter
                                    onClick={openColumnFilter === col ? () => setOpenColumnFilter(null) : () => setOpenColumnFilter(col)}
                                    className={`cursor-pointer ${filters.find((f) => f.name === col) ? 'text-green-500' : ''} scale-[.95]`}
                                />
                            </div>
                        ))}
                    </div>
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <Table
                                width={width}
                                height={600}
                                headerHeight={0}
                                rowHeight={40}
                                rowCount={currData.length}
                                rowGetter={({ index }) => currData[index]}
                                rowClassName={({ index }) => (index % 2 === 0 ? 'bg-zinc-300' : 'bg-zinc-200')}
                            >
                                {columns.map((col, index) => (
                                    <Column key={index} label={col} dataKey={col} width={300} cellRenderer={cellRenderer} />
                                ))}
                            </Table>
                        )}
                    </AutoSizer>
                </div>
            )}
        </div>
    );
};
