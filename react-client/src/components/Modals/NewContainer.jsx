import React, { useEffect, useState } from 'react'
import { Checkbox } from '../Checkbox'

const rolesRef = [
    { id: 'role1', name: 'roles', value: 'Role 1', label: 'Role 1', checked: true },
    { id: 'role2', name: 'roles', value: 'Role 2', label: 'Role 2', checked: true },
    { id: 'role3', name: 'roles', value: 'Role 3', label: 'Role 3', checked: true },
    { id: 'role4', name: 'roles', value: 'Role 4', label: 'Role 4', checked: true },
    { id: 'role5', name: 'roles', value: 'Role 5', label: 'Role 5', checked: true },
];

export const NewContainer = ({closeModal}) => {

    const [container, setContainer] = useState({label: '', description: ''})
    // const [containerRoles, setContainerRoles] = useState([])
    const [validated, setValidated] = useState(false)
    const [roles, setRoles] = useState(rolesRef)


    const submitContainer = () => {
        if(validated) {
            console.log(container);
            console.log(roles.filter(r => r.checked).map(r => r.id).join(","));
            closeModal()

        }
    }

    const handleCheckboxChange = (e) => {
        const {id} = e.target 
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === id ? { ...role, checked: !role.checked } : role
          )
        );

        
    };

    const handleContainerChange = (e) => {
        const {name, value} = e.target

        setContainer((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })

        
    }

    useEffect(() => {
        if((container.label && container.label.length > 2) && (container.description && container.description.length > 2) && roles.filter(r => r.checked).length > 0){
            setValidated(true)
        } else {
            setValidated(false)
        }
    }, [container, roles])
    

  return (
    <div className="absolute transition-transform duration-200 top-12 right-0 bg-zinc-300 p-6 border border-zinc-400 rounded-md z-[1] ">
        <div className="flex flex-col gap-3">
            <div className="flex gap-4">

                <div className="flex flex-col gap-1">
                    <label className='font-semibold' htmlFor="container-label">Label</label>
                    <input onChange={handleContainerChange} value={container.label} name='label' className='p-1 rounded-md' type="text" id='container-label' placeholder='Label' />

                </div>
                <div className="flex flex-col gap-1">
                    <label className='font-semibold' htmlFor="container-desc">Description</label>
                    <input onChange={handleContainerChange} value={container.description} name='description' className='p-1 rounded-md' type="text" id='container-desc' placeholder='Description' />

                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className='font-semibold'>Roles</label>
                <div className="flex flex-col bg-white overflow-y-scroll h-44 p-1">
                    {roles.map((role) => (
                        <Checkbox
                        key={role.id}
                        id={role.id}
                        name={role.name}
                        value={role.value}
                        label={role.label}
                        checked={role.checked}
                        onChange={handleCheckboxChange}
                        />
                    ))}

                </div>
                
                

            </div>
            <div>
                <button disabled={!validated} onClick={submitContainer} className={` ${validated ? 'active:scale-[.95] bg-green-300' : ' bg-zinc-400 text-zinc-300'}   shadow-md shadow-zinc-200 rounded-md p-2 px-4 border border-zinc-700`}>Create</button>
            </div>
        </div>
    </div>
  )
}
