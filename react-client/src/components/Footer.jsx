import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Company Name</h2>
          <p className="text-sm">© 2024 Company Name. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400">About Us</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
