import React, { useContext } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../context/MyContext'

export default function PaymentCancelled() {
    const {loader , setloader} = useContext(MyContext)
    const nav = useNavigate()
    const navigation = (path) => {
        setloader(true)
        nav(path)
    }
    return (
        <React.Fragment>
            <div className='w-full flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center bg-white rounded-xl shadow-xl max-w-2xl px-5 py-5 gap-y-5 xl:mt-[10%] sm:mt-[20%] mt-[40%]'>
                    <div className='flex flex-col justify-center items-center'>
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h1 className='text-xl font-bold text-red-700'>Payment was cancelled</h1>
                    </div>
                    <Button name="Back to Home" click={() => navigation('/')} />
                </div>
            </div>

        </React.Fragment>
    )
}
