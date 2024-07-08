import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { IoCheckmark } from "react-icons/io5";
import { MdCheckBoxOutlineBlank, MdCheckBox  } from "react-icons/md";



export const ColumnList = ({ options, label, onSelect, toggleAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionList, setOptionList] = useState(options);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (col) => {
    onSelect(col);
    setOptionList(() => {
        return optionList.map(c => {
            if(c.name == col) {
                return {
                    ...c,
                    include: !c.include
                }
            }

            return c
            
        })
    })
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
    if (options) {
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

    return (
        <div className="relative inline-block min-w-52" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown} 
            className="w-full bg-white border border-gray-300 rounded shadow p-1 flex justify-between items-center"
          >
            <span>Columns</span>
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
              <div onClick={toggleAll} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <p onClick={toggleAll} className=''>Check all</p>
                {optionList.filter(o => o.include).length == optionList.length ? <MdCheckBox onClick={toggleAll} className='text-2xl text-blue-500'/> : <MdCheckBoxOutlineBlank onClick={toggleAll} className='text-2xl text-blue-500' />}
                
              </div>
              
              {optionList && optionList.map((option, index) => (
                <div 
                  key={index} 
                  onClick={() => handleOptionClick(option.name)} 
                  className="p-2 relative hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <p title={option.name} className='truncate'>{option.name}</p>
                  {option.include ? <MdCheckBox onClick={() => handleOptionClick(option.name)} className='text-2xl text-blue-500'/> : <MdCheckBoxOutlineBlank onClick={() => handleOptionClick(option.name)} className='text-2xl text-blue-500' />}
                  {/* <p onClick={() => handleOptionClick(option.name)} className={` ${option.include ? 'bg-blue-400' : 'bg-white'} absolute right-5 top-3 text-center`}><IoCheckmark className='text-white font-semibold' /></p> */}
                </div>
              ))}
              
            </div>
          )}
        </div>
    );
  
}
