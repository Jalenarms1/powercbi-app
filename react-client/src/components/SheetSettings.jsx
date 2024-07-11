import React, { useEffect, useState } from 'react'
import { get } from '../utils'
import Dropdown from './Dropdown'
import { ColumnList } from './ColumnList'
import { useReportContext } from '../context/ReportContext'

export const SheetSettings = ({currentSheet, updateSheet, currentReport, redirectToDataView}) => {

    const [fieldsToUpd, setFieldsToUpd]= useState(null)
    const [dataSourceList, setDataScourceList] = useState(null)
    const [dataSource, setDataSource] = useState(null)
    const [dataSourceColumns, setDataSourceColumns] = useState(null)
    const [parameters, setParameters] = useState([])
    const [getColErr, setGetColErr] = useState(false)

    const {filters, setFilters, sortList, setSortList} = useReportContext()

    useEffect(() => {
        if(currentSheet) {
            setDataSource({name: currentSheet.dataSource, type_desc: currentSheet.dataSourceType})
            
        }
    }, [currentSheet])

    const getColumns = async () => {
        setGetColErr(false)
        let queryStr = `?name=${dataSource.name}&type=${dataSource.type_desc}`

        if(dataSource.type_desc == 'SQL_STORED_PROCEDURE') { 
            queryStr += `&exec=exec ${dataSource.name} ${parameters.map(p => `'${p}'`)}`
        }
        const {data} = await get(`/master-list/data-source-columns${queryStr}`)

        if (data.error) {
            setGetColErr(true)
        } else {
            let colData = data
            if(dataSource.name == currentSheet.dataSource.split(" ")[0] || dataSource.name == currentSheet.dataSource) {  
                console.log('currentSource', dataSource);                  
                colData = colData.map(c => {
                    return {
                        ...c,
                        include: currentSheet.columnList.split(",").includes(c.name)
                    }
                })
            }
            console.log('setData', colData);
            setDataSourceColumns(colData)

        }

    }

    useEffect(() => {
        const getDataSources = async () => {
            const {data} = await get('/master-list/data-sources')

            setDataScourceList(data)
        }

        getDataSources()
    }, [])

    useEffect(() => {
        if (parameters) {
            setDataSourceColumns(null)
        }
    }, [parameters])

    useEffect(() => {
        if(dataSource) {
           
            if(dataSource.name == currentSheet.dataSource.split(" ")[0] || dataSource.name == currentSheet.dataSource) {
                getColumns()
                setParameters(currentSheet.parameters?.split(",") ?? [])
            } else {
                setParameters([])
                setDataSourceColumns(null)

            }
        }
    }, [dataSource])

    const handleParameterInput = (e, i) => {
        setParameters(parameters.map((p, indx) => {
            if (i == indx) {
                return e.target.value
            } else {
                return p
            }
        }))
    }

    const handleRemoveParam = (i) => {
        let paramList = []

        parameters.forEach((p, indx) => {
            if(indx != i) paramList.push(p)
        })
        
        setParameters(paramList)
    }

    useEffect(() => {
        if(currentSheet) {
            setParameters(currentSheet.parameters?.split(",") ?? [])
        }
    }, [currentSheet])

    console.log('dataSourceColumns', dataSourceColumns);

    const handleSave = (col) => {

        let dataQuery;

        if (dataSource.type_desc == 'VIEW') {
            dataQuery = `select ${dataSourceColumns.filter(f => f.include).map(c => `[${c.name}]`).join(",")} from ${dataSource.name}`
        } else {
            
            dataQuery = `exec ${dataSource.name} ${parameters.map(p => `'${p}'`).join(", ")};`
        }

        const updObj = {
            parameters: parameters.join(','), 
             
            dataQuery, 
            columnList: dataSourceColumns.filter(f => f.include).map(c => c.name).join(",")
        }

        
        // dataSourceColumns.filter(f => f.include).map(c => c.name)

        if (dataSource.name != currentSheet.dataSource.split(" ")[0] && dataSource.name != currentSheet.dataSource) {
            updObj.dataSource = dataSource.name
            updObj.dataSourceType = dataSource.type_desc
        }

        updateSheet(updObj, currentSheet.uid, currentReport.uid)

        redirectToDataView()
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
    <div className='w-full flex flex-col h-[100vh] gap-10'>
        <div className="flex gap-10 ">
            <div className="flex flex-col min-w-96 max-w-fit  gap-2">
                <label htmlFor="upd-title" className='font-semibold'>Data source: <span className='font-normal ml-2'>{currentSheet.dataSource}</span></label>
                <Dropdown label={'Select a data source'} options={dataSourceList} onSelect={(opt) => setDataSource(opt)} />
                <button disabled={dataSourceColumns} onClick={getColumns} className={` ${dataSourceColumns ? 'bg-zinc-400 text-zinc-300' : 'bg-blue-500 text-white'} rounded-md  px-2 py-1 w-fit active:scale-[.95]`}>Confirm data source</button>
                {getColErr && <p className='text-xs text-red-500'>Error getting columns. Check required paramters.</p>}
                {(dataSource && dataSource.type_desc == 'SQL_STORED_PROCEDURE') && <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-col gap-4">
                        <p>{dataSource.type_desc != 'VIEW' ? `exec ${dataSource.name} ${parameters.join(", ")}` : dataSource.name}</p>
                        <p className="">Parameters</p>
                    </div>
                    {parameters.map((p, i) => (
                        <div className="flex items-center gap-2">
                            <input onChange={(e) => handleParameterInput(e, i)} value={parameters[i]} type='text' placeholder='Enter Parameter' className='p-1 rounded-md bg-zinc-100 shadow-sm shadow-zinc-300' />
                            <button onClick={() => handleRemoveParam(i)} className='text-center border border-zinc-800 font-semibold active:scale-[.95] p-1 px-2 rounded-md'>-</button>
                        </div>
                    
                    ))}
                    <button className='border rounded-md border-zinc-800 active:scale-[.95] p-1 shadow-sm shadow-zinc-400' onClick={() => setParameters([...parameters, ''])}>+ Add parameter</button>
                </div>}
            </div>
            {<div className="flex flex-col w-1/3 max-w-[35vw]  gap-2">
                <label htmlFor="upd-title" className='font-semibold'>Columns:</label>
                {dataSourceColumns && <ColumnList toggleAll={toggleAllCols} label={'Select columns to show'} options={dataSourceColumns} onSelect={(opt) => setDataSourceColumns(dataSourceColumns.map(c => c.name == opt ? {...c, include: !c.include} : c))} />}
                
            </div>}
            
            

        </div>
        <button  disabled={!dataSourceColumns} onClick={handleSave} className={` ${dataSourceColumns ? 'bg-white border hover:bg-blue-500 text-blue-500 hover:text-white active:scale-[.95]' : ' bg-zinc-300 text-zinc-200'}   shadow-md shadow-zinc-200 w-fit px-4 py-2 rounded-md`}>Save</button>
        <div className='flex flex-col gap-6'>
        </div>
    </div>
  )
}
