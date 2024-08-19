import React, { useContext, useEffect, useState } from 'react';
import AdminDashboardNavbar from './AdminDashboardNavbar';
import { useAuth } from '@clerk/clerk-react';
import Postform from '../../components/Post/PostForm';
import { get, remove } from "../../api"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MyContext } from '../../context/MyContext';
import Button from '../../components/Button';
import ErrorModal from '../../components/Modals/ErrorModal';
import Modal from '../../components/Modals/Modal';
import Spinener from "../../components/Loaders/Spinner"


export default function Users() {
    const { loader, setloader, PostForm, setPostForm, errorModal, seterrorModal, setmodal, modal } = useContext(MyContext)
    const [users, setusers] = useState([])
    const [popupMessage, setpopupMessage] = useState('')
    const [totalUsers, settotalUsers] = useState()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await get('/user/getAll')
                console.log(res);
                setusers(res.data.users)
                settotalUsers(users.length)
            } catch (error) {
                console.log(error);

            }
        }
        fetchUsers()
    }, [])

    const deleteUser = async (index) => {
        const deleteUserObj = {
            userId: users[index]._id
        }
        setloader(true)
        try {
            const res = remove('/user/deleteUser', deleteUserObj)
            setloader(false)
            if (res) {
                setmodal(true)
            }
        } catch (error) {
            console.log(error);
            setloader(false)
            seterrorModal(true);
            setpopupMessage(error.response.data.message);

        }


    }

    return (
        <React.Fragment>
            <div className='grid grid-cols-[auto,1fr] h-screen'>
                <AdminDashboardNavbar />
                <div className='flex flex-col justify-center  sm:ml-[14vw] md:ml-[20vw] lg:ml-[8vw] gap-y-5'>
                    <div className='flex flex-col  gap-4 justify-between items-start w-full'>
                        <div className='bg-white sm:w-[30vw] lg:w-[20vw] w-[70vw] rounded-lg p-4 flex flex-col shadow-xl justify-start items-start gap-y-3'>
                            <div className='px-3 py-3 bg-gray-300 rounded-full'>
                                <i className='fa-solid fa-users text-[30px]'></i>
                            </div>
                            <h1 className='text-md font-bold'>Total Users</h1>
                            <h1 className='text-3xl font-bold'>{totalUsers}</h1>
                        </div>
                        <div className="bg-white shadow-md rounded-lg w-full h-[50vh] overflow-y-scroll mb-5 ">
                            <div className='lg:block hidden'>
                                <div className="grid grid-cols-4 w-full gap-4 py-4 px-6 bg-rose-700 ">
                                    <h3 className="text-xs md:text-sm font-medium text-white">Avatar</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Username</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Email</h3>
                                </div>
                            </div>

                            {
                                users && users.map((items, index) => (
                                    <div className="border-t border-gray-200 odd:bg-gray-200 lg:p-0 p-4" key={index}>
                                        <div className="lg:grid flex flex-col gap-y-5 grid-cols-4 w-full items-center gap-x-20 sm:gap-x-4  py-4 px-6 relative">

                                            <div className="flex justify-between gap-x-5 w-full items-center ">
                                                <p className="text-xs font-medium lg:hidden block text-gray-500">Avatar:</p>
                                                <div className="flex items-center">
                                                    <img src={items.avatarUrl} alt="User Image" className="w-8 h-8 rounded-full mr-4 " />

                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-x-5 w-full items-center  ">
                                                <p className="text-xs font-medium lg:hidden block text-gray-500">User Name:</p>
                                                <p className="text-xs md:text-md font-medium text-gray-800">{items.userName}</p>

                                            </div>
                                            <div className="flex justify-between gap-x-5 w-full items-center  ">
                                                <p className="text-xs font-medium lg:hidden block text-gray-500">Email:</p>
                                                <p className="text-xs md:text-md font-medium text-gray-800">{items.email}</p>

                                            </div>

                                            <div className='lg:absolute lg:right-14 lg:top-3 bottom-0'>
                                                <Button name="Delete" click={() => deleteUser(index)} />
                                            </div>


                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {errorModal && popupMessage && <ErrorModal error="Error deleting Users" errormsg={popupMessage} />}
            {modal && <Modal modalMsg="User deleted Successfully" click={() => setmodal(false)} success btnText="Ok" btnClass="" />}
            {PostForm && <Postform />}
            {loader && <Spinner />}
        </React.Fragment>
    );
}
