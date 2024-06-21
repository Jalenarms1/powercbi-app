import React from 'react'
import { Link } from 'react-router-dom'

export const NavItem = ({label, path, active}) => {
  return (
    <Link to={path} className={`text-white hover:text-zinc-300 cursor-pointer ${active ? ' border-b border-zinc-300' : ''}`}>{label}</Link>
  )
}
