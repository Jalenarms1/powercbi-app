import React from 'react'

export const ReportNav = ({option, active, onClick}) => {
  return (
    <button onClick={onClick} className={`${active ? 'border-b border-zinc-500' : ' text-zinc-400 hover:text-black'}`}>{option}</button>
  )
}
