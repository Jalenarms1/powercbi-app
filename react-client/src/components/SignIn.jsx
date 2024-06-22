import axios from 'axios'
import React, { useState } from 'react'
import { ROOT_API_URL, post } from '../utils'
import { saveUser } from '../jwt-helper'
import { useAuth } from '../context/AuthContext'

export const SignIn = () => {
    const [username, setUsername] = useState(null)

    const onChangeUsername = (e) => {
        const username = e.target.value

        setUsername(username)
    }

    const {submitLogin} = useAuth()

    

  return (
    <div className='h-screen w-full flex justify-center items-center relative bg-slate-900'>
        <div className="absolute top-0 left-0 p-3">
            <p className="text-2xl font-semibold text-white">Community Bridges Inc.</p>
        </div>
        <div className="w-1/3 flex bg-white flex-col gap-8 justify-center items-center p-5 border rounded-md border-zinc-400 shadow-md shadow-zinc-600">
            <p className="text-xl font-semibold">Please enter your username to continue.</p>
            <div className="flex flex-col gap-4 w-full">
                <input value={username} onChange={onChangeUsername} type="text" placeholder='Username' id='username' className='w-full border border-zinc-400 shadow-md shadow-zinc-200 p-1 rounded-md' />
                <button onClick={() => submitLogin(username)} className={`${(username && username?.length > 3) ? 'bg-blue-950 text-white active:scale-[.95]' : 'bg-zinc-400 text-zinc-300'}    transition-transform w-full text-white p-1 rounded-md`} disabled={(!username && username?.length < 3)}>Submit</button>
 
            </div>
        </div>
    </div>
  )
}
