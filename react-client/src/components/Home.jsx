import React, { useEffect, useState } from 'react'
import { AiTwotoneFolderAdd } from "react-icons/ai";
import { ListItem } from './ListItem';
import { NewContainer } from './Modals/NewContainer';
import { useContainerContext } from '../context/ContainerContext';
import { CiSearch } from "react-icons/ci";



export const Home = () => {

    const [openNewContainer, setOpenNewContainer] = useState(false)

    const {containers} = useContainerContext()

    const [containerList, setContainerList] = useState(containers)

    const toggleOpenContainer = () => {
        setOpenNewContainer(!openNewContainer)
    }

    const handleSearchInput = (e) => {
        const {value} = e.target
        console.log(value);
        if (value.trim() != ''){
            setContainerList(() => {
                return containerList.filter(c => c.label.toLowerCase().includes(value.toLowerCase()))
            })

        } else {
            setContainerList(containers)
        }
    }

    useEffect(() => {
        setContainerList(containers)
    }, [containers])

  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <p className="text-3xl text-black font-semibold">Report Containers</p>
            <div className="flex gap-4">
                <div className="relative">
                    <input onChange={handleSearchInput} type="text" className='p-1 rounded-md bg-zinc-200 shadow-sm shadow-zinc-200 pr-8' placeholder='Search for a container' />
                    <CiSearch className='absolute right-2 top-2' />
                </div>
                <AiTwotoneFolderAdd onClick={toggleOpenContainer} title='Add new container' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' />

            </div>
            {openNewContainer && <NewContainer closeModal={toggleOpenContainer} />}
        </div>
        <div className="flex flex-wrap gap-4">
            {containerList?.map((c, i) => (
                <ListItem item={c} />

            ))}
            {containerList?.length == 0 && <p>None.</p>}
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
