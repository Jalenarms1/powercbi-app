import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";
import { Link } from 'react-router-dom';


export const Sidebar = ({path}) => {
  const [isOpen, setIsOpen] = useState(true);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



  return (
    <div className={`relative  ${isOpen ? 'w-[250px] mr-7' : ''}`}>
      <button
        className={`py-4 px-1  text-black mt-2 bg-zinc-400 absolute ${isOpen ? 'translate-x-[222px] rounded-bl-md  rounded-tl-md' : 'translate-x-0 rounded-br-md  rounded-tr-md'} transition-transform transform  text-center z-[1]`}
        onClick={toggleSidebar}
      >
        {isOpen ? <MdArrowBackIos className='ml-1' /> : <MdArrowForwardIos className='ml-1' />}
      </button>
      <div
        className={`absolute left-0 h-screen bg-slate-900 p-3 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <h2 className="text-white text-3xl mb-2 title-font font-semibold p-1">PowerCBI</h2>
        <div className="text-white flex flex-col gap-1">
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Home</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">My Reports</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Report Request</Link>
          <Link to={'/'} className=" hover:bg-slate-800 rounded-md p-1">Support</Link>
          
        </div>
      </div>
    </div>
  );
};

