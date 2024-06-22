import React, { useState } from 'react'
import { AiTwotoneFolderAdd } from "react-icons/ai";
import { Container } from './Container';
import { NewContainer } from './Modals/NewContainer';
import { useContainerContext } from '../context/ContainerContext';



export const Home = () => {

    const [openNewContainer, setOpenNewContainer] = useState(false)

    const {containers} = useContainerContext()

    const toggleOpenContainer = () => {
        setOpenNewContainer(!openNewContainer)
    }

  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <p className="text-5xl text-black">Report Containers</p>
            <AiTwotoneFolderAdd onClick={toggleOpenContainer} title='Add new container' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' />
            {openNewContainer && <NewContainer closeModal={toggleOpenContainer} />}
        </div>
        <div className="flex flex-wrap gap-4">
            {containers?.map((c, i) => (
                <Container label={c.label} />

            ))}
            {/* <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} />
            <Container label={'Container'} /> */}
        </div>
    </div>
  )
}
