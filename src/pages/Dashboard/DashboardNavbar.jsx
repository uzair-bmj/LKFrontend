import React, { useState } from 'react';
import DashboardNavlist from './DashboardNavlist';

export default function DashboardNavbar() {
    const [showNavbar, setShowNavbar] = useState(false);

    function toggleNavbar() {
        setShowNavbar(!showNavbar);
    }

    return (
        <React.Fragment>
            <div className='flex h-screen z-[1]'>
                <i className="fa-solid fa-bars text-[30px] cursor-pointer sm:hidden block mt-2" onClick={toggleNavbar}></i>
                <div className={`fixed top-0 left-0 h-[200vh]  sm:h-screen bg-rose-700 text-white w-[70vw] sm:w-[35vw] md:w-[30vw] lg:w-[20vw] shadow-2xl py-8 transition-transform duration-300 ease-in-out ${showNavbar ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
                    <i className="fa-solid fa-xmark text-[30px] absolute top-5 left-5 cursor-pointer sm:hidden" onClick={toggleNavbar}></i>
                    <div className='flex flex-col justify-center  gap-y-10 mt-10'>
                        <div>
                            <h1 className='text-3xl font-bold text-center'>USER'S DASHBOARD</h1>
                        </div>
                        <div className='w-full'>
                            <DashboardNavlist />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
