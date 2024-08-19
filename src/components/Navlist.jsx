import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../context/MyContext';
import { useUser } from '@clerk/clerk-react';
import ErrorModal from './Modals/ErrorModal';

export default function Navlist(props) {
    const location = useLocation();
    const className = `${props.class} flex flex-col gap-y-5 `;
    const { loader, setloader, errorModal, seterrorModal } = useContext(MyContext)
    const { user, isSignedIn } = useUser()
    const nav = useNavigate()
    const navigation = (path) => {
        if (isSignedIn) {
            setloader(true)
            nav(path)
        } else {
            seterrorModal(true)
            
        }


    }


    return (
        <>
            <ul className={className}>
                <div className='flex gap-x-3 cursor-pointer items-center' onClick={() => navigation('/')}>
                    <i className={`fa-solid fa-house ${location.pathname === '/' ? 'text-rose-700' : "text-gray-400"}  hover:text-rose-700 hover:transition hover:duration-300`} ></i>
                    <li className={`text-md font-medium ${location.pathname === '/' ? 'text-black' : 'text-gray-400'} hover:text-black  hover:transition hover:duration-300`}>Home</li>
                </div>

                <div className='flex gap-x-3 cursor-pointer items-center' onClick={() => navigation('/dashboard/approvedposts')}>
                    <i className={`fa-solid fa-table-list ${location.pathname === '/dashboard/approvedposts' ? 'text-rose-700' : "text-gray-400"} hover:text-rose-700 hover:transition hover:duration-300`}></i>
                    <li className={`text-md font-medium ${location.pathname === '/dashboard/approvedposts' ? 'text-black' : 'text-gray-400'} hover:text-black  hover:transition hover:duration-300`}>Dashboard</li>
                </div>
            </ul>
            {errorModal && <ErrorModal error="Authentication Error" errormsg="Please Login first" />}
        </>
    );
}
