import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";
import { Link } from 'react-router-dom';


export const Sidebar = ({path}) => {
  const [isOpen, setIsOpen] = useState(true);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



  return (
    <div className={`relative  ${isOpen ? 'max-w-[20vw] min-w-[20vw] ' : 'w-[0px] mr-2'} min-h-screen bg-slate-900 `}>
      <button
        className={`py-4 px-1  text-white mt-2 bg-slate-900 absolute ${isOpen ? 'translate-x-[19vw] rounded-br-md  rounded-tr-md rounded-tl-sm rounded-bl-sm' : 'translate-x-0 rounded-br-md  rounded-tr-md'} transition-transform transform  text-center z-[1]`}
        onClick={toggleSidebar}
      >
        {isOpen ? <MdArrowBackIos className='ml-1' /> : <MdArrowForwardIos className='ml-1' />}
      </button>
      <div className={`${!isOpen ? 'hidden' : ''} transform duration-100`}>
        <h2 className="text-white text-4xl  title-font font-semibold p-3 overflow-x-hidden">PowerCBI</h2>
        <div className="text-white flex flex-col gap-1 p-2 overflow-x-hidden">
          <Link to={'/'} className={` hover:bg-slate-800 ${path == '/' ? 'bg-slate-800' : ''} rounded-md p-1 `}>Home</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">My Reports</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Report Request</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Support</Link>
          
        </div>

      </div>
      
    </div>
  );
};

