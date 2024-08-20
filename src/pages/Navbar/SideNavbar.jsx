import React, { useState } from 'react'
import Navlist from '../../components/Navlist'
import Button from '../../components/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import { MyContext } from "./../../context/MyContext"
import { useContext } from 'react'
import { RiAdminFill } from "react-icons/ri";
import { useUser } from '@clerk/clerk-react'
import ErrorModal from '../../components/Modals/ErrorModal'

export default function SideNavbar() {
    const { loader, setloader, PostForm, setPostForm, seterrorModal, errorModal } = useContext(MyContext)
    const nav = useNavigate()
    const { isSignedIn } = useUser()
    const [error, seterror] = useState('')
    const navigation = (path) => {
        if (isSignedIn) {
            setloader(true)
            nav(path)
        } else {
            setloader(false)
            seterror("Authentication error")
            seterrorModal(true)

        }

    }
    const location = useLocation()
    return (
        <React.Fragment>
            <div className='flex h-screen'>
                <div className='sm:block hidden '>
                    <div className=' bg-white sm:w-[20vw] md:w-[15vw] flex flex-col justify-start gap-y-5 items-center h-screen  shadow-2xl py-8 fixed top-0 left-0'>
                        <div className='flex flex-col justify-center items-center gap-y-8'>
                            <div>
                                <h1 className='text-3xl font-bold text-rose-600 '>LK</h1>
                            </div>
                            <div className='bg-gray-300 py-[1px] xl:px-20 sm:px-14 rounded'>
                            </div>
                            <div>
                                <Navlist />
                            </div>
                            <div className='bg-gray-300 py-[1px] xl:px-20 sm:px-14  rounded'>
                            </div>
                            <div>
                                <ul className='flex flex-col  gap-y-5'>
                                    {/* <div className='flex gap-x-3 cursor-pointer items-center'>
                                        <i class={`fa-solid fa-gear ${location.pathname === '/settings' ? 'text-rose-700' : "text-gray-400"} hover:text-rose-700 `}></i>
                                        <li className={`${location.pathname === "/settings" ? 'text-black' : "text-gray-400"} hover:text-black  text-md font-medium  `}>Settings</li>
                                    </div> */}
                                    <div className='flex gap-x-3 cursor-pointer items-center' onClick={() => navigation('/admin')}>
                                        <RiAdminFill size="18px" className={` ${location.pathname === '/admin' ? 'text-rose-700' : "text-gray-400"} hover:text-rose-700 hover:transition hover:duration-300`} />
                                        <li className={`text-md font-medium ${location.pathname === '/admin' ? 'text-black' : 'text-gray-400'} hover:text-black  hover:transition hover:duration-300`}>Admin</li>
                                    </div>
                                </ul>
                            </div>

                        </div>

                    </div>
                </div>
            </div >
            <div className='block sm:hidden fixed bottom-[-10px] left-0 right-0 bg-white w-full py-6 rounded-xl px-6 z-10 shadow-2xl'>
                <ul className='flex justify-between w-full'>
                    <li>
                        <i class={`fa-solid fa-house ${location.pathname === "/" ? "text-rose-700" : "text-gray-400"} hover:text-rose-700 hover:transition hover:duration-300 text-[25px]`} onClick={() => navigation('/')}></i>
                    </li>

                    <li>
                        <i class={`fa-solid fa-table-list ${location.pathname === "/dashboard/approvedposts" ? "text-rose-700" : "text-gray-400"} hover:text-rose-700 hover:transition hover:duration-300 text-[25px]`} onClick={() => navigation('/dashboard/approvedposts')}></i>
                    </li>
                    <li>
                        <i class={`fa-regular fa-square-plus hover:transition hover:text-rose-700 hover:duration-300 text-[25px]`} onClick={() => setPostForm(true)}></i>
                    </li>
                    <li>
                        <RiAdminFill size="25px" className={` ${location.pathname === '/admin' ? 'text-rose-700' : "text-gray-400"} hover:text-rose-700 hover:transition hover:duration-300`} onClick={() => navigation('/admin')} />
                    </li>
                    
                </ul>
            </div>
            {errorModal && <ErrorModal error={error} errormsg="Please Login first" />}
        </React.Fragment >
    )
}
