import { useContext, createContext, useState, useEffect } from "react";
import { get, post } from "../utils";
import { useAuth } from "./AuthContext";


const ReportContext = createContext(null)

export const ReportContextProvider  = ({children}) => {

    const [reports, setReports] = useState(null)
    const [currentReport, setCurrentReport] = useState(null)
    const [currentReportData, setCurrentReportData] = useState(null)
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
        setCurrentReportData(null)
        const {data} = await get(`/report/find?reportId=${id}`)

        setCurrentReport(data)
    }

    const getReportData = async (dataSource, dataSourceType, columnList) => {
        setCurrentReportData(null)
        const {data} = await get(`/report/data?dataSource=${dataSource}&dataSourceType=${dataSourceType}&columnList=${columnList}`)

        setCurrentReportData(data)
    }

    return <ReportContext.Provider value={{submitReport, getReports, reports, currentReport, getReport, getReportData, currentReportData}}>
        {children}
    </ReportContext.Provider>
}

export const useReportContext = () => {
    return useContext(ReportContext)
}