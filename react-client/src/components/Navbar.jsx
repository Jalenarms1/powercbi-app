import React, { useEffect, useState } from 'react'
import { IoIosLogOut } from "react-icons/io";
import { NavItem } from './NavItem';
import { useAuth } from '../context/AuthContext';
import logo from '../cbi_logo.png'


export const Navbar = ({path}) => {
  console.log(path);
  const [confirmLogout, setConfirmLogout] = useState(false)

  const {logoutUser, user} = useAuth()

  useEffect(() => {
    if(confirmLogout) {
      setTimeout(() => {
        setConfirmLogout(false)
      }, 5000)
    }
  }, [confirmLogout])

  return (
    <>
      {user && <div className='w-full bg-slate-900 flex justify-between items-center p-3 px-5 shadow-md shadow-zinc-400 border-b border-zinc-800'>
        <div className="text-white">
            {/* <p className="text-2xl font-semibold">Community Bridges Inc.</p> */}
            <img src={logo} alt="cbi logo" className='w-52' />
        </div>
        <div className='flex items-center gap-6 '>
          <NavItem label={"Home"} path={"/"} active={path == '/'} />
          <NavItem label={"My Reports"} path={"/my-reports"} active={path == '/my-reports'} />
          <NavItem label={"Request Report"} path={"/request-report"} active={path == '/request-report'} />
          {!confirmLogout && <IoIosLogOut onClick={() => setConfirmLogout(true)} className='text-white text-2xl cursor-pointer active:text-zinc-300' />}
          {confirmLogout && <IoIosLogOut onClick={logoutUser} className='text-white text-2xl cursor-pointer active:text-zinc-300 bg-red-600 rounded-md shadow-md shadow-red-600' />}

        </div>
      </div>}
    
    </>
  )
}
