import React from 'react'

export const SignIn = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center relative'>
        <div className="absolute top-0 left-0 p-3">
            <p className="text-2xl font-semibold">Community Bridges Inc.</p>
        </div>
        <div className="w-1/3 flex flex-col gap-8 justify-center items-center p-5 border rounded-md border-zinc-400 shadow-md shadow-zinc-400">
            <p className="text-xl font-semibold">Please enter your username to continue.</p>
            <div className="flex flex-col gap-4 w-full">
                <input type="text" placeholder='Username' className='w-full p-1 rounded-md' />
                <button className='bg-blue-950 active:scale-[.95] transition-transform w-full text-white p-1 rounded-md'>Submit</button>

            </div>
        </div>
    </div>
  )
}
