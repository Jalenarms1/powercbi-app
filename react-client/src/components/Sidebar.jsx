import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos  } from "react-icons/md";


export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative w-full'>
      <button
        className={`py-4 px-1 rounded-br-md mt-2 rounded-tr-md text-black  bg-zinc-400 absolute ${isOpen ? 'translate-x-[250px]' : 'translate-x-0'} transition-transform transform  text-center z-[1]`}
        onClick={toggleSidebar}
      >
        {isOpen ? <MdArrowBackIos className='ml-1' /> : <MdArrowForwardIos className='ml-1' />}
      </button>
      <div
        className={`fixed  left-0 h-full bg-zinc-950 p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <h2 className="text-white text-xl mb-4">Sidebar</h2>
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

