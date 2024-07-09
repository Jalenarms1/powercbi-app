import { useContext, createContext, useState, useEffect } from "react";
import { del, get, getFilterColsFromStr, getFiltersStr, getSortListStr, getSortsFromStr, post, put, sortArr } from "../utils";
import { useAuth } from "./AuthContext";


const ReportContext = createContext(null)

export const ReportContextProvider  = ({children}) => {

    const [reports, setReports] = useState(null)
    const [currentReport, setCurrentReport] = useState(null)
    const [currentReportData, setCurrentReportData] = useState(null)
    const [myReports, setMyReports] = useState(null)
    const [currentSheet, setCurrentSheet] = useState(null)
    const [currentSheetData, setCurrentSheetData] = useState(null)
    const [dataHx, setDataHx] = useState({})
    const [viewData, setViewData] = useState(null)
    const [filters, setFilters] = useState([])
    const [sortList, setSortList] = useState([])
    const [dataErr, setDataErr] = useState(false)

    const {user} = useAuth()

    const submitReport = async (title, dataSource, parameters, dataSourceType, columnList, containerId) => {
        
        const resp = await post('/report/add', {title, dataSource, parameters, dataSourceType, columnList, user: user.username, containerId})
    
    }

    const getReports = async (containerId) => {
        const {data} = await get(`/report/list?containerId=${containerId}`)

        
        setReports(data)
    }

    const getReport = async (id) => {
        setCurrentReport(null)
        setCurrentSheet(null)
        const {data} = await get(`/report/find?reportId=${id}`)

        setCurrentReport(data)
    }

    const getReportData = async (dataSource, dataSourceType, columnList) => {
        setCurrentReportData(null)
        const {data} = await get(`/report/data?dataSource=${dataSource}&dataSourceType=${dataSourceType}&columnList=${columnList}`)

        setCurrentReportData(data.data)
    }

    const getMyReports = async () => {
        const {data} = await get(`/report/my-reports?user=${user.username}`)
        setMyReports(data)
    }

    const getSheetData = async (sheet) => {
        setDataErr(false)
        setCurrentSheetData(null)
        const {data} = await get(`/sheet?sheetId=${sheet.uid}&dataSource=${sheet.dataSource}&dataSourceType=${sheet.dataSourceType}&columnList=${sheet.columnList}&parameters=${sheet.parameters}`)
        
        if (data.err) {
            setDataErr(true)
        } else {
            setDataHx({...dataHx, [sheet.uid]: data})
            setCurrentSheetData(data)

        }

    }

    const handleSetSheet = (sheet) => {
        setCurrentSheet(sheet)
    }

    const addSheet = async (sheet) => {
        setCurrentReport(null)
        const resp = await post('/sheet/add', {...sheet, reportId: currentReport.uid})

        await getReport(currentReport.uid)

    }

    const updateSheet = async (fieldsToUpd, sheetId, reportId) => {

        if (!fieldsToUpd.filters && !Object.keys(fieldsToUpd).includes('dataSource')) {
            fieldsToUpd.filters = getFiltersStr(filters)
        }

        if(!fieldsToUpd.orderBy && !Object.keys(fieldsToUpd).includes('dataSource')) {
            fieldsToUpd.orderBy = getSortListStr(sortList)
        }

        console.log(fieldsToUpd);

        const {data} = await put(`/sheet/update?sheetId=${sheetId}`, fieldsToUpd)
        getReport(reportId)
        if(Object.keys(fieldsToUpd).includes('dataSource')) {
            setDataHx({...dataHx, [sheetId]: null})

        }
        console.log('updated sheet', data);
        handleSetSheet(data)
        // getSheetData(data)
    }

    const removeSheet = async (sheetId) => {
        const resp = await del(`/sheet/remove?sheetId=${sheetId}`)

        getReport(currentReport.uid)
    }

    

    useEffect(() => {
        if(user) {
            getMyReports()
        }
    }, [user])

    useEffect(() => {
        if(currentReport) {
            handleSetSheet(currentSheet ?? currentReport?.sheets[0])
        }

    }, [currentReport])

    useEffect(() => {
        if(currentSheetData && !dataErr) {
            let cData = [...currentSheetData]
            if (filters.length > 0) {
                filters.forEach(f => {
                    cData = [...cData].filter(d => {
                        let val = `${d[f.name]}`.trim() != 'null' ? `${d[f.name]}` : '(blank)'
                        
                        
                        return f.values.map(v => `${v}`).includes(val)
                    })
                })
    
            } 

            if(sortList.length > 0) {
                
                sortList.forEach(s => {
                    cData = sortArr(cData, s.sort, s.name)
                }) 
            }
            setViewData(cData)

        }
    }, [filters, sortList, currentSheetData])

    useEffect(() => {
        setFilters([])
        setSortList([])
        if(currentSheet) {
            if(currentSheet.filters) {
                setFilters(getFilterColsFromStr(currentSheet.filters))
            }

            if(currentSheet.orderBy) {
                setSortList(getSortsFromStr(currentSheet.orderBy))
            }
            if (dataHx[currentSheet.uid]) {
                setCurrentSheetData(dataHx[currentSheet.uid])
            } else if (currentSheet.data) {
                setCurrentSheetData(currentSheet.data)
            } else {
                setCurrentSheetData(null)

            }
            
        }
    }, [currentSheet])


    return <ReportContext.Provider value={{submitReport, dataErr, getReports, reports, currentReport, getReport, getReportData, currentReportData, getMyReports, myReports, currentSheet, currentSheetData, handleSetSheet, getSheetData, addSheet, updateSheet, filters, setFilters, sortList, setSortList, viewData, removeSheet}}>
        {children}
    </ReportContext.Provider>
}

export const useReportContext = () => {
    return useContext(ReportContext)
}