import React, { useEffect, useState } from 'react'
import { get } from '../utils'
import Dropdown from './Dropdown'
import { ColumnList } from './ColumnList'

export const SheetSettings = ({currentSheet}) => {

    const [fieldsToUpd, setFieldsToUpd]= useState(null)
    const [dataSourceList, setDataScourceList] = useState(null)
    const [dataSource, setDataSource] = useState(null)
    const [dataSourceColumns, setDataSourceColumns] = useState(null)
    const [parameters, setParameters] = useState([])

    useEffect(() => {
        if(currentSheet) {
            setDataSource({name: currentSheet.dataSource, type_desc: currentSheet.dataSourceType})
        }
    }, [currentSheet])

    const getColumns = async () => {
        let queryStr = `?name=${dataSource.name}&type=${dataSource.type_desc}`

        if(dataSource.type_desc == 'SQL_STORED_PROCEDURE') { 
            queryStr += `&exec=exec ${dataSource.name} ${parameters.map(p => `'${p}'`)}`
        }
        const {data} = await get(`/master-list/data-source-columns${queryStr}`)

        let colData = data
        if(dataSource.name == currentSheet.dataSource.split(" ")[0]) {  
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

    useEffect(() => {
        const getDataSources = async () => {
            const {data} = await get('/master-list/data-sources')

            setDataScourceList(data)
        }

        getDataSources()
    }, [])

    useEffect(() => {
        if(dataSource) {
            console.log(currentSheet.dataSource);
            console.log(currentSheet.dataSource.split(" ")[0]);
            console.log(dataSource.name == currentSheet.dataSource.split(" ")[0]);
            console.log(dataSource.name);
            if(dataSource.name == currentSheet.dataSource.split(" ")[0] || dataSource.name == currentSheet.dataSource) {
                getColumns()
            } else {
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

    console.log('dataSourceColumns', dataSourceColumns);

  return (
    <div className='w-full flex flex-col h-[100vh]'>
        <div className="flex gap-10 ">
            <div className="flex flex-col w-1/3 max-w-[25vw] gap-2">
                <label htmlFor="upd-title" className='font-semibold'>Data source: <span className='font-normal ml-2'>{currentSheet.dataSource}</span></label>
                <Dropdown label={'Select a data source'} options={dataSourceList} onSelect={(opt) => setDataSource(opt)} />
                {(dataSource && dataSource.type_desc == 'SQL_STORED_PROCEDURE') && <div className="flex flex-col items-start gap-2">
                    <p className="">Parameters</p>
                    {parameters.map((p, i) => (
                        <div className="flex items-center gap-2">
                            <input onChange={(e) => handleParameterInput(e, i)} value={parameters[i]} type='text' placeholder='Enter Parameter' className='p-1 rounded-md' />
                            <button onClick={() => handleRemoveParam(i)} className='text-center border border-zinc-800 font-semibold active:scale-[.95] p-1 px-2 rounded-md'>-</button>
                        </div>
                    
                    ))}
                    <button className='border rounded-md border-zinc-800 active:scale-[.95] p-1 shadow-sm shadow-zinc-400' onClick={() => setParameters([...parameters, ''])}>+ Add parameter</button>
                </div>}
            </div>
            {dataSourceColumns ? <div className="flex flex-col w-1/3 gap-2">
                <label htmlFor="upd-title" className='font-semibold'>Columns:</label>
                <ColumnList label={'Select columns to show'} options={dataSourceColumns} onSelect={(opt) => setDataSourceColumns(dataSourceColumns.map(c => c.name == opt ? {...c, include: !c.include} : c))} />
            </div> : 
            (
                <div className="flex flex-col gap-2">
                    <label htmlFor="upd-title" className='font-semibold'>Columns:</label>

                    <button onClick={getColumns} className='bg-blue-500 text-white px-2 py-1 rounded-sm'>Confirm data source</button>
                </div>
            )}

        </div>
    </div>
  )
}
