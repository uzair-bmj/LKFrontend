import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from "../../context/MyContext";

export default function AdminDashboardNavbar() {
    const [showNavbar, setShowNavbar] = useState(false);
    const { loader, setloader } = useContext(MyContext)
    const location = useLocation()
    const nav = useNavigate()
    const navigation = (path) => {
        setloader(true)
        nav(path)
    }


    function toggleNavbar() {
        setShowNavbar(!showNavbar);
    }

    return (
        <React.Fragment>
            <div className='h-screen z-[1]'>

                <i className="fa-solid fa-bars text-[30px] cursor-pointer md:hidden block mt-2" onClick={toggleNavbar}></i>
                <div className='h-screen'>
                    <div className={`fixed top-0 left-0 h-[200vh] sm:h-screen bg-rose-700 text-white w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[15vw] shadow-2xl py-8 transition-transform duration-300 ease-in-out ${showNavbar ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
                        <i className="fa-solid fa-xmark text-[30px] absolute top-5 left-5 cursor-pointer sm:hidden" onClick={toggleNavbar}></i>
                        <div className='flex flex-col justify-between items-center gap-y-8 '>
                            <div className='w-full flex flex-col gap-y-5'>
                                <h1 className='text-3xl font-bold text-center sm:mt-0 mt-5'>ADMIN</h1>
                                {/* <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/admin/users" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/admin/users")}>
                                    <i class="fa-solid fa-users text-[18px]" ></i>
                                    <p className='font-medium'>Users</p>
                                </div> */}
                            </div>
                            <div className='w-full fixed bottom-32 sm:bottom-5'>
                                <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/")}>
                                    <i class="fa-solid fa-home text-[18px]" ></i>
                                    <p className='font-medium'>Home</p>
                                </div>
                            </div>


                        </div>

                    </div>

                </div>

            </div>
        </React.Fragment>
    );
}
