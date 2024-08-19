import React, { useContext } from 'react'
import { MyContext } from '../../context/MyContext'

export default function Modal({ modalMsg, click, cancel, btnText, success , btnClass}) {
    const { modal, setmodal } = useContext(MyContext)
    return (
        <React.Fragment>
            {
                modal &&
                <div id="popup-modal" tabindex="-1" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-white bg-opacity-70 ">
                    <div className="relative p-4 w-full max-w-md max-h-full top-[50%] left-[50%]" style={{ transform: "translate(-50% , -50%)" }}>
                        <div className="relative bg-white rounded-lg shadow ">
                            <div className="p-4 md:p-5 text-center">
                                {
                                    success ?
                                        <i className="fa-solid fa-circle-check text-gray-400 text-[30px] mb-4"></i>
                                        :
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                }

                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{modalMsg}</h3>
                                <button data-modal-hide="popup-modal" type="button" className={`${btnClass} text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`} onClick={click}>
                                    {btnText}
                                </button>
                                {
                                    cancel && <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => setmodal(false)}>No, cancel</button>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            }


        </React.Fragment>
    )
}
