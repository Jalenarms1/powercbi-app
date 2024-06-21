import React from 'react'
import { FcFolder } from 'react-icons/fc'

export const Container = ({label}) => {
  return (
    <div title={label} className="container active:scale-[.9] transition-transform p-3 gap-2 bg-zinc-300 shadow-md shadow-zinc-400 cursor-pointer max-w-72  border border-zinc-400 flex rounded-md">
        <FcFolder className='text-3xl flex-shrink-0' />
        <p className="text-lg flex-grow truncate">{label}</p>
    </div>
  )
}
