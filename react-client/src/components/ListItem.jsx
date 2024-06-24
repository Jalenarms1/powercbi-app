import React from 'react'
import { FcFolder } from 'react-icons/fc'
import { Link } from 'react-router-dom'

export const ListItem = ({item}) => {
  return (
    <Link to={`/container/${item.uid}`}  title={item.label} className="container active:scale-[.9] transition-transform p-3 gap-2 bg-zinc-200 shadow-md shadow-zinc-300 cursor-pointer max-w-72  border border-zinc-400 flex rounded-md">
        <FcFolder className='text-3xl flex-shrink-0' />
        <p className="text-lg flex-grow truncate">{item.label}</p>
    </Link>
  )
}
