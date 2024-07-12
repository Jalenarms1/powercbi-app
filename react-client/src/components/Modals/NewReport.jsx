import React, { useEffect, useState } from 'react'
import { get } from '../../utils'
import { CgCloseR } from "react-icons/cg";
import Dropdown from '../Dropdown';
import { Checkbox } from '../Checkbox';
import { ColumnList } from '../ColumnList';
import { useReportContext } from '../../context/ReportContext';


export const NewReport = ({closeModal, containerId}) => {

    const [dataSources, setDataScources] = useState(null)
    const [currentDataSource, setCurrentDataSource] = useState(null)
    const [parameters, setParameters] = useState([])
    const [dataSourceColumns, setDataSourceColumns] = useState(null)
    const [columnErr, setColumnErr] = useState(null)
    const {submitReport, getReports} = useReportContext()
    const [reportTitle, setReportTitle] = useState(null)

    const handleParameterInput = (e, i) => {
        setParameters(parameters.map((p, indx) => {
            if (i == indx) {
                return e.target.value
            } else {
                return p
            }
        }))
    }

    const handleReportSubmit = async () => {
        if (validReport()) {
            console.log('Submitted');
            await submitReport(
                reportTitle.trim(), 
                currentDataSource.name,
                parameters.join(','), 
                currentDataSource.type_desc, 
                dataSourceColumns.filter(c => c.include).map(c => c.name.trim()).join(','),
                containerId
            )
            closeModal()
            getReports(containerId)
        }
    }

    const validReport = () => {
        return ((reportTitle && reportTitle.trim() != '') && (currentDataSource && dataSourceColumns))
    }

    const handleRemoveParam = (i) => {
        let paramList = []

        parameters.forEach((p, indx) => {
            if(indx != i) paramList.push(p)
        })
        
        setParameters(paramList)
    }

    const getDSColumns = async () => {
        let queryStr;

        if (currentDataSource.type_desc == 'VIEW') {
            queryStr = `name=${currentDataSource.name}&type=${currentDataSource.type_desc}`
        } else {
            queryStr = `type=${currentDataSource.type_desc}&exec=exec ${currentDataSource.name} ${parameters.map(p => `'${p}'`).join(',')}`
        }

        const {data} = await get(`/master-list/data-source-columns?${queryStr}`)

        if (data.error) {
            setColumnErr(data.error)
            setDataSourceColumns(null)
        } else {
            setDataSourceColumns(data)
            setColumnErr(null)

        }
    }

    useEffect(() => {
        const getDataSourceList = async () => {
            const {data} = await get('/master-list/data-sources')


            setDataScources(data)
        }

        getDataSourceList()
    }, [])

    

    const handleColumnToggle = (col) => {
        setDataSourceColumns(() => {
            return dataSourceColumns.map(c => {
                if(c.name == col) {
                    return {
                        ...c,
                        include: !c.include
                    }
                }

                return c
            })
        })
    }

    const toggleAllCols = () => {
        if (dataSourceColumns.filter(c => c.include).length == dataSourceColumns.length) {
            setDataSourceColumns(dataSourceColumns.map(c => {
                return {
                    ...c,
                    include: false
                }
            }))
        } else {
            setDataSourceColumns(dataSourceColumns.map(c => {
                return {
                    ...c,
                    include: true
                }
            }))
        }
    }

  return (
    <div className="absolute transition-transform overflow-y-scroll duration-200 inset-0 w-full h-[70vh] bg-zinc-300 p-6 border border-zinc-400 rounded-md z-[1] ">
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between">
                <p className="text-xl font-semibold">Create a report</p>
                <div className="flex items-center gap-2">
                    <button onClick={handleReportSubmit} className={` ${validReport() ? 'bg-green-400 text-white active:scale-[.95]' : 'bg-zinc-500 text-zinc-400'}  rounded-md px-3 py-1`} disabled={!validReport()}>Create</button>
                    <button onClick={closeModal} className=' border border-zinc-800 active:scale-[.95] rounded-md px-3 py-1'>Close</button>
                    {/* <CgCloseR onClick={closeModal} className='text-xl cursor-pointer active:scale-[.95]' /> */}

                </div>
            </div>
            <div className="flex flex-wrap w-full gap-6">
                <div className="flex flex-col">
                    <label htmlFor="report-title">Title</label>
                    <input maxLength={200} value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} type="text" id='report-title' placeholder='Title...' className='p-1 rounded-md' />
                </div>
                <div className="flex flex-col gap-4 w-96 min-w-fit">
                    <div className="flex flex-col">
                        <p className="">Data Source</p>
                        <Dropdown onSelect={setCurrentDataSource} label={'Select a data source'} options={dataSources ?? null}  />
                    </div>
                    {(currentDataSource && currentDataSource.type_desc == 'SQL_STORED_PROCEDURE') && <p className='font-semibold'>exec {currentDataSource.name} {parameters.map(p => `'${p}'`).join(',')}</p>}
                    {currentDataSource && <button onClick={getDSColumns} className='bg-green-400 w-fit px-2 py-1  rounded-md text-white font-semibold shadow-sm shadow-zinc-500 active:scale-[.95]'>Confirm Data Source</button>}
                    {columnErr && <p className='text-red-500 text-sm w-full'>{columnErr}</p>}
                    {(currentDataSource && currentDataSource.type_desc == 'SQL_STORED_PROCEDURE') && <div className="flex flex-col items-start gap-2">
                        <p className="">Parameters</p>
                        {parameters.map((p, i) => (
                            <div className="flex items-center gap-2">
                                <input onChange={(e) => handleParameterInput(e, i)} value={parameters[i]} type='text' placeholder='Enter Parameter' className='p-1 rounded-md' />
                                <button onClick={() => handleRemoveParam(i)} className='text-center border border-zinc-800 font-semibold active:scale-[.95] p-1 px-2 rounded-md'>-</button>
                            </div>
                        
                        ))}
                        <button className='border rounded-md border-zinc-800 active:scale-[.95] p-1 shadow-md shadow-zinc-400' onClick={() => setParameters([...parameters, ''])}>+ Add parameter</button>
                    </div>}
                </div>
                {dataSourceColumns && dataSourceColumns.length > 0 && <div className='flex flex-col w-96'>
                    <p>Columns</p>
                    {/* <div className="flex flex-col bg-white p-1 gap-2 rounded-md">
                        {dataSourceColumns.map((c, i) => (
                            <Checkbox onChange={handleColumnToggle} id={c.name} name={c.name} value={c.name} checked={c.include} label={c.name} key={i} />
                        ))}

                    </div> */}
                    <ColumnList toggleAll={toggleAllCols} label={'Choose column list'} options={dataSourceColumns} onSelect={handleColumnToggle} />
                </div>}
            </div>
        </div>
    </div>
  )
}
