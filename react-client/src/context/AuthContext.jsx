import { createContext, useContext, useEffect, useState } from "react";
import { get, post } from "../utils";
import { logout, saveUser } from "../jwt-helper";
import { useLocation, useNavigate } from "react-router-dom";


const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)

    const navigate = useNavigate()


    const submitLogin = async (username) => {
        try {
            const {data} = await post('/login', {username})

            saveUser(data.token)
            setUser(data.username)
            console.log('user valid');
        } catch (error) {
            console.error('Error logging in', error);
        }

    }

    const logoutUser = () => {
        logout()
        setUser(null)
        navigate('/')
        
    }

    useEffect(() => {
        const getMe = async () => {
            const {data} = await get('/get-me')

            setUser(data.user)
        }

        getMe()
    }, [])

    return (
        <AuthContext.Provider value={{submitLogin, user, setUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

