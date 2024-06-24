import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "../utils";


const ContainerContext = createContext(null)


export const ContainerProvider = ({children}) => {

    const [containers, setContainers] = useState(null)
    const [currentContainer, setCurrentContainer] = useState(null)

    const submitContainer = async (container, roles, validated, closeModal) => {
        if(validated) {
            const roleList = roles.filter(r => r.checked).map(r => r.id).join(",")

            const resp = await post("/container/add", {...container, roles: roleList})

            console.log(resp);

            closeModal()

        }
    }

    const getContainers = async () => {
        const {data} = await get('/container/list')

        console.log('containers', data);

        setContainers(data)
    }

    const getContainer = async (id) => {
        const {data} = await get(`/container/${id}`)
        console.log('container', data);
        setCurrentContainer(data[0])
    }

    useEffect(() => {
        
        getContainers()
    }, [])

    return <ContainerContext.Provider value={{containers, getContainers, submitContainer, getContainer, currentContainer}}>
        {children}
    </ContainerContext.Provider>
}


export const useContainerContext = () => {
    return useContext(ContainerContext)
}