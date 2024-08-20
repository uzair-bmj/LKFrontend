import React, { useContext, useEffect, useState } from 'react'
import DashboardNavbar from './DashboardNavbar'
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaCartFlatbedSuitcase } from "react-icons/fa6";
import { MyContext } from '../../context/MyContext';
import Postform from '../../components/Post/PostForm';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../api';

// Utility function to format the date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}



export default function Sales() {
    const { loader, setloader, PostForm, setPostForm } = useContext(MyContext)
    const [salesData, setsalesData] = useState([])
    const [totalSales, settotalSales] = useState('')
    const [totalEarning, settotalEarning] = useState('')
    const { user, isSignedIn } = useUser()
    const nav = useNavigate()
    useEffect(() => {
        if (!isSignedIn) {
            nav('/')
        }
        const fetchPosts = async () => {
            const res = await post('/userPosts', { userId: user.id })
            const approvedPosts = res.data.posts.filter((post) =>
                post.status.toLowerCase().includes('approved')
            )

            const allPurchases = approvedPosts.flatMap(post => post.purchasedBy);
            setsalesData(allPurchases);
            settotalSales(allPurchases.length);
            const TotalEarning = salesData.reduce((acc, item) => {
                return acc += item.amount
            }, 0)
            console.log(TotalEarning);
            settotalEarning(TotalEarning)


        }
        fetchPosts()
    }, [isSignedIn, nav, totalEarning])




    return (
        <React.Fragment>
            <div className='grid grid-cols-[auto,1fr] h-screen'>
                <DashboardNavbar />
                <div className='flex flex-col h-screen py-5 sm:ml-[20vw] md:ml-[20vw] lg:ml-[8vw] gap-y-5 mt-2 px-2 sm:mb-0 mb-16'>
                    <h1 className='text-xl font-bold text-center sm:text-start'>Sales Insight</h1>
                    <div className='flex flex-col sm:flex-row justify-center items-center sm:justify-start gap-4 w-full'>
                        <div className='bg-white sm:w-[30vw] lg:w-[20vw] w-[70vw] rounded-lg p-4 flex flex-col shadow-xl justify-start items-start gap-y-3'>
                            <div className='px-3 py-2 bg-gray-300 rounded-full'>
                                <FaCircleDollarToSlot size="30px" />
                            </div>
                            <h1 className='text-md font-bold'>Total Earnings</h1>
                            <h1 className='text-3xl font-bold'><sup className='text-gray-400 font-light text-xl'>$</sup>{totalEarning}</h1>
                        </div>
                        <div className='bg-white lg:w-[20vw] sm:w-[30vw] w-[70vw] rounded-lg p-4 flex flex-col shadow-xl justify-start items-start gap-y-3'>
                            <div className='px-3 py-2 bg-gray-300 rounded-full'>
                                <FaCartFlatbedSuitcase size="30px" />
                            </div>
                            <h1 className='text-md font-bold'>Total Sales</h1>
                            <h1 className='text-3xl font-bold'>{totalSales}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-3 w-full'>
                        <h1 className='text-xl font-bold sm:text-start text-center'>Orders</h1>
                        <div className="bg-white shadow-md rounded-lg w-full h-[50vh] overflow-y-scroll mb-20 sm:mb-5">
                            <div className='lg:block hidden'>
                                <div className="grid grid-cols-5 w-full gap-4 py-4 px-6 bg-rose-700 lg:grid-cols-5">
                                    <h3 className="text-xs md:text-sm font-medium text-white">Customer</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Product Image</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Product Name</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Order Date</h3>
                                    <h3 className="text-xs md:text-sm font-medium text-white">Amount</h3>
                                </div>
                            </div>

                            {
                                salesData && salesData.map((items, index) => (
                                    <div className="border-t border-gray-200 odd:bg-gray-200 p-4" key={index}>
                                        <div className="lg:grid lg:grid-cols-5 lg:gap-4 lg:py-2  flex flex-col gap-y-5 sm:block">
                                            {/* Customer */}
                                            <div className="flex justify-between gap-x-5 w-full items-center sm:mb-4 ">
                                                <p className="text-xs font-medium lg:hidden block text-gray-500">Customer:</p>
                                                <div className="flex items-center">
                                                    <img src={items.userAvatar} alt="User Image" className="w-8 h-8 rounded-full mr-4 hidden sm:block" />
                                                    <div>
                                                        <p className="text-xs md:text-lg font-medium text-gray-800">{items.userName}</p>
                                                        <p className="text-xs text-gray-500">{items.userEmail}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Product Image */}
                                            <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                                                <p className="text-xs lg:hidden block font-medium text-gray-500">Product Image:</p>
                                                <img
                                                    src={items.productImage}
                                                    className="w-[20vw] ms-6 sm:w-10 h-20 sm:h-10"
                                                    alt=""
                                                />
                                            </div>
                                            {/* Product Name */}
                                            <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                                                <p className="text-xs lg:hidden block font-medium text-gray-500">Product Name:</p>
                                                <p className="text-xs md:text-lg font-medium text-gray-800">{items.productName}</p>
                                            </div>
                                            {/* Order Date */}
                                            <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                                                <p className="text-xs lg:hidden block font-medium text-gray-500">Order Date:</p>
                                                <p className="text-xs md:text-sm font-medium text-gray-500">{formatDate(items.createdAt)}</p>
                                            </div>
                                            {/* Amount */}
                                            <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                                                <p className="text-xs lg:hidden block font-medium text-gray-500">Amount:</p>
                                                <p className="text-xs md:text-lg font-medium text-gray-800">${items.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>





                    </div>
                </div>
            </div>
            {PostForm && <Postform />}
        </React.Fragment>
    )
}
