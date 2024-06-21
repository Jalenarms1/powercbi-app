import React from 'react'
import { IoIosLogOut } from "react-icons/io";
import { NavItem } from './NavItem';


export const Navbar = ({path}) => {
  console.log(path);
  return (
    <div className='w-full bg-zinc-950 flex justify-between items-center p-3 px-5 shadow-md shadow-zinc-400 border-b border-zinc-800'>
      <div className="text-white">
          <p className="text-2xl font-semibold">Community Bridges Inc.</p>
      </div>
      <div className='flex items-center gap-6 '>
        <NavItem label={"Home"} path={"/"} active={path == '/'} />
        <NavItem label={"My Reports"} path={"/my-reports"} active={path == '/my-reports'} />
        <IoIosLogOut className='text-white text-2xl cursor-pointer active:text-zinc-300' />

      </div>
    </div>
  )
}
