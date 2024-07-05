import { useContext, createContext, useState, useEffect } from "react";
import { get, post } from "../utils";
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

    const {user} = useAuth()

    const submitReport = async (title, dataSource, dataSourceType, columnList, containerId) => {
        
        const resp = await post('/report/add', {title, dataSource, dataSourceType, columnList, user: user.username, containerId})
    
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
        console.log('REPORT', data);

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
        const {data} = await get(`/sheet?sheetId=${sheet.uid}&dataSource=${sheet.dataSource}&dataSourceType=${sheet.dataSourceType}&columnList=${sheet.columnList}`)

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

    

    useEffect(() => {
        if(user) {
            getMyReports()
        }
    }, [user])

    useEffect(() => {
        if(currentReport) {
            handleSetSheet(currentReport.sheets[0])
        }

    }, [currentReport])

    useEffect(() => {
        if(currentSheet) {
            if (dataHx[currentSheet.uid]) {
                setCurrentSheetData(dataHx[currentSheet.uid])
            } else {
                setCurrentSheetData(null)

            }
        }
    }, [currentSheet])

    return <ReportContext.Provider value={{submitReport, getReports, reports, currentReport, getReport, getReportData, currentReportData, getMyReports, myReports, currentSheet, currentSheetData, handleSetSheet, getSheetData, addSheet}}>
        {children}
    </ReportContext.Provider>
}

export const useReportContext = () => {
    return useContext(ReportContext)
}