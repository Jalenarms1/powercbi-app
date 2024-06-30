import React from 'react';
import { formatDateIfDate } from '../utils';

const ActiveColCell = ({value, onToggle}) => {

    return (
        <div className='flex items-center gap-2 w-full'>
            {/* <p>{value == 1 ? 'yes' : 'no'}</p> */}
            <button onClick={onToggle} className={`w-4 h-4 active:scale-[.95] mx-auto rounded-sm ${value == 1 ? 'bg-blue-500' : 'bg-zinc-300'}`}></button>
        </div>
    )
}

const DynamicTable = ({ data, columns, onActiveToggle }) => {

   
    

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(col => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>

            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.uid}>
              {columns.map((k, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap">{k == 'active' ? <ActiveColCell onToggle={() => onActiveToggle(row['uid'], row['active'])} value={row[k]} /> : formatDateIfDate(row[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
