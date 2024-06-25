import { useContext, createContext, useState, useEffect } from "react";
import { post } from "../utils";
import { useAuth } from "./AuthContext";


const ReportContext = createContext(null)

export const ReportContextProvider  = ({children}) => {

    const [reports, setReport] = useState(null)

    const {user} = useAuth()

    const submitReport = async (title, dataSource, dataSourceType, columnList, containerId) => {
        
        const resp = await post('/report/add', {title, dataSource, dataSourceType, columnList, user: user.username, containerId})
    
        console.log(resp);
    }

    return <ReportContext.Provider value={{submitReport}}>
        {children}
    </ReportContext.Provider>
}

export const useReportContext = () => {
    return useContext(ReportContext)
}