import React from 'react';
import logo from '../cbi_logo.png'

const Footer = () => {
  return (
    <footer className="bg-zinc-900  p-3 shadow-sm shadow-zinc-400 border-t border-zinc-400 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <img src={logo} alt='logo' className='w-44' />
        </div>
        {/* <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400">About Us</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
