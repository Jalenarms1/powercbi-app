import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";
import { Link } from 'react-router-dom';


export const Sidebar = ({path}) => {
  const [isOpen, setIsOpen] = useState(true);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



  return (
    <div className={`relative  ${isOpen ? 'w-[300px] mr-2' : 'w-[0px]'} min-h-screen bg-slate-900 `}>
      <button
        className={`py-4 px-1  text-black mt-2 bg-zinc-400 absolute ${isOpen ? 'translate-x-[235px] rounded-br-md  rounded-tr-md' : 'translate-x-0 rounded-br-md  rounded-tr-md'} transition-transform transform  text-center z-[1]`}
        onClick={toggleSidebar}
      >
        {isOpen ? <MdArrowBackIos className='ml-1' /> : <MdArrowForwardIos className='ml-1' />}
      </button>
      <h2 className="text-white text-3xl  title-font font-semibold p-3">PowerCBI</h2>
      <div className="text-white flex flex-col gap-1 p-2 overflow-x-hidden">
        <Link to={'/'} className={` hover:bg-slate-800 ${path == '/' ? 'bg-slate-800' : ''} rounded-md p-1`}>Home</Link>
        <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">My Reports</Link>
        <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Report Request</Link>
        <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Support</Link>
        
      </div>
      
    </div>
  );
};

