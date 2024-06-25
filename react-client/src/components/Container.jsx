import React, { useEffect, useState } from 'react'
import { AiTwotoneFolderAdd } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { ListItem } from './ListItem'
import { useContainerContext } from '../context/ContainerContext'
import { NewReport } from './Modals/NewReport'

export const Container = () => {

    const {id} = useParams()
    const {getContainer, currentContainer} = useContainerContext()
    const [openNewReport, setOpenNewReport] = useState(false)

    console.log(currentContainer);

    useEffect(() => {
        getContainer(id)
    }, [id])

    const toggleNewReport = () => {
        setOpenNewReport(!openNewReport)
    }

  return (
    <div className='flex flex-col p-3 w-full gap-4'>
        <div className="w-full relative border-b border-zinc-600 p-2 flex justify-between items-center">
            <div className="flex flex-col gap-2">
                {currentContainer && <p className="text-3xl text-black font-semibold">{currentContainer.label} - Reports</p>}
                {currentContainer && <p className="text-xl text-zinc-400">{currentContainer.description}</p>}

            </div>

            <AiTwotoneFolderAdd onClick={toggleNewReport} title='Add new report' className='text-3xl cursor-pointer active:scale-[.95] rounded-md' />
            {openNewReport && <NewReport containerId={id} closeModal={toggleNewReport} />}
        </div>
        <div className="flex flex-wrap gap-4">
            {/* {containers?.map((c, i) => (
                <ListItem label={c.label} />

            ))} */}
            
        </div>
    </div>
  )
}
