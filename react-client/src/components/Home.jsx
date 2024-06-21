import React from 'react'
import { AiTwotoneFolderAdd } from "react-icons/ai";
import { Container } from './Container';



export const Home = () => {
  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full border-b border-zinc-600 p-2 flex justify-between items-center">
            <p className="text-5xl text-black">Report Containers</p>
            <AiTwotoneFolderAdd title='Add new container' className='text-3xl cursor-pointer active:shadow-md active:shadow-zinc-400 rounded-md' />
        </div>
        <div className="flex flex-wrap gap-4">
            <Container label={'Container sdfsdf sdfsdf sfsdsdfsf'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
        </div>
    </div>
  )
}
