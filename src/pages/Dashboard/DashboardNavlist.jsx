import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { RxCrossCircled } from "react-icons/rx";
import { FcSalesPerformance } from "react-icons/fc";
import { MyContext } from '../../context/MyContext';

export default function DashboardNavlist() {
    const { loader, setloader } = useContext(MyContext)
    const location = useLocation()
    const nav = useNavigate()
    const navigation = (path) => {
        setloader(true)
        nav(path)
    }
    return (
        <React.Fragment>

            <ul className='flex flex-col  w-full justify-center'>
                <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/")}>
                    <i class="fa-solid fa-home text-[18px]" ></i>
                    <li className='font-medium'>BACK TO HOME</li>
                </div>
                <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/dashboard/approvedposts" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/dashboard/approvedposts")}>
                    <FaCheckCircle size="18px" color='white' className=' ' />
                    <li className='font-medium'>APPROVED POSTS</li>
                </div>
                <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/dashboard/rejectedPosts" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/dashboard/rejectedPosts")}>
                    <RxCrossCircled size="20px" color='white' className='' />
                    <li className='font-medium'>REJECTED POSTS</li>
                </div>
                <div className={`flex gap-x-3 items-center w-full justify-center ${location.pathname === "/dashboard/sales" ? "bg-rose-400" : "bg-transparent"}  hover:bg-rose-400 hover:transition-all hover:duration-500 px-4 py-4 cursor-pointer`} onClick={() => navigation("/dashboard/sales")}>
                    <i class="fa-solid fa-coins text-[18px]" ></i>
                    <li className='font-medium'>SALES OVERVIEW</li>
                </div>
            </ul>
        </React.Fragment >
    )
}
