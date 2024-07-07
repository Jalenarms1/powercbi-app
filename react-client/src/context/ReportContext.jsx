import { useContext, createContext, useState, useEffect } from "react";
import { get, getFilterColsFromStr, getSortsFromStr, post, put } from "../utils";
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

    const {user} = useAuth()

    const submitReport = async (title, dataSource, parameters, dataSourceType, columnList, containerId) => {
        
        const resp = await post('/report/add', {title, dataSource, parameters, dataSourceType, columnList, user: user.username, containerId})
    
        console.log(resp);
    }

    const getReports = async (containerId) => {
        const {data} = await get(`/report/list?containerId=${containerId}`)

        
        setReports(data)
    }

    const getReport = async (id) => {
        setCurrentReport(null)
        setCurrentReportData(null)
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
        setCurrentSheetData(null)
        const {data} = await get(`/sheet?sheetId=${sheet.uid}&dataSource=${sheet.dataSource}&dataSourceType=${sheet.dataSourceType}&columnList=${sheet.columnList}&parameters=${sheet.parameters}`)
        console.log('data');
        setDataHx({...dataHx, [sheet.uid]: data})
        setCurrentSheetData(data)

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
        const {data} = await put(`/sheet/update?sheetId=${sheetId}`, fieldsToUpd)
        getReport(reportId)
        handleSetSheet(data)
        // setDataHx({...dataHx, [sheetId]: null})
        // getSheetData(data)
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
        // if(currentSheetData) {
        //     setViewData(currentSheetData)
        // }
    }, [currentSheetData])

    useEffect(() => {
        if(currentSheetData) {
            console.log('filtering');
            let cData = [...currentSheetData]
            console.log(cData);
            if (filters.length > 0) {
                filters.forEach(f => {
                    cData = [...cData].filter(d => {
                        
                        return f.values.map(v => `${v}`).includes(`${d[f.name]}`)
                    })
                })
    
            } 

            console.log(cData);

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
            console.log('filteredData', cData);
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
            } else {
                setCurrentSheetData(null)

            }
        }
    }, [currentSheet])

    console.log('dataHx', dataHx);

    return <ReportContext.Provider value={{submitReport, getReports, reports, currentReport, getReport, getReportData, currentReportData, getMyReports, myReports, currentSheet, currentSheetData, handleSetSheet, getSheetData, addSheet, updateSheet, filters, setFilters, sortList, setSortList, viewData}}>
        {children}
    </ReportContext.Provider>
}

export const useReportContext = () => {
    return useContext(ReportContext)
}