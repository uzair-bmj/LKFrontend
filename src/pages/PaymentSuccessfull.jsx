import React, { useContext } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../context/MyContext'

export default function PaymentSuccessfull() {
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
                        <i className="fa-solid fa-circle-check text-green-700 text-[60px] mb-4"></i>
                        <h1 className='text-xl font-bold text-green-700'>Payment Successfull</h1>
                    </div>
                    <h1 className='text-md font- text-gray-400'>Transaction was successfull check you email for details</h1>
                    <Button name="Back to Home" click={()=>navigation('/')} />
                </div>
            </div>

        </React.Fragment>
    )
}
