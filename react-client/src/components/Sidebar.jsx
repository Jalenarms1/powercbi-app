import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";


export const Sidebar = () => {
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
        className={`absolute  left-0 h-screen bg-slate-900 p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <h2 className="text-white text-2xl mb-4 title-font font-semibold">PowerCBI</h2>
        <ul className="text-white">
          <li className="mb-2"><a href="#">Home</a></li>
          <li className="mb-2"><a href="#">About</a></li>
          <li className="mb-2"><a href="#">Services</a></li>
          <li className="mb-2"><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

