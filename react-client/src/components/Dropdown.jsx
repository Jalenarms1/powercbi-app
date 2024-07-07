import React, { useEffect, useState, useRef } from 'react';
import { CiSearch } from "react-icons/ci";

const Dropdown = ({ options, label, onSelect, currentOptId=null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionList, setOptionList] = useState(options);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    if (value.trim() !== '') {
      setOptionList(() => {
        return options.filter(i => i.name.toLowerCase().includes(value.toLowerCase()));
      });
    } else {
      setOptionList(options);
    }
  };

  useEffect(() => {
    if (!optionList) {
      setOptionList(options);
    }
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  console.log('options', options);

  return (
    <div className="relative inline-block min-w-52" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown} 
        className="w-full bg-white border border-gray-300 rounded shadow p-1 flex justify-between items-center"
      >
        <span>{selectedOption ? selectedOption.name : label}</span>
        <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-scroll bg-white border border-gray-300 rounded shadow">
          <div className="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
            <input onChange={handleSearchChange} type="text" className='w-4/5' />
            <CiSearch className='text-xl w-1/5' />
          </div>
          {optionList && optionList.map((option, index) => (
            <div 
              key={index} 
              onClick={() => handleOptionClick(option)} 
              className={`p-2 hover:bg-gray-100 cursor-pointer ${(currentOptId == option?.uid && currentOptId) ? 'bg-gray-100' : ''}`}
            >
              {option.name}
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default Dropdown;
