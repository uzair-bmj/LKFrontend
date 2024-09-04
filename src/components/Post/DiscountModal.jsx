import React, { useContext, useState } from 'react';
import { MyContext } from '../../context/MyContext';
import Button from '../Button';
import SmallLoader from '../Loaders/SmallLoader';
import ErrorModal from '../Modals/ErrorModal';
import { useUser } from '@clerk/clerk-react';
import { put } from '../../api';
import Modal from '../Modals/Modal';

export default function DiscountModal() {
    const { PostForm, setPostForm, smallLoader, setsmallLoader, errorModal, seterrorModal, postSuccess, setpostSuccess, discountModal, setdiscountModal, editPostObjHook, seteditPostObjHook, modal, setmodal } = useContext(MyContext);
    const [popupMessage, setpopupMessage] = useState('')
    const [discount, setdiscount] = useState(0);
    const { user } = useUser()

    const addDiscount = async (e) => {
        e.preventDefault()
        const discObj = {
            postId: editPostObjHook.postId,
            userId: user.id,
            discount
        }
        setsmallLoader(true)
        try {
            const res = await put('/post/addDiscount', discObj)
            if (res) {
                setsmallLoader(false)
                console.log(res.data);
                setmodal(true)
                setpopupMessage("Discount added Successfully")
                // setdiscountModal(false)
            }

        } catch (error) {
            setsmallLoader(false)
            console.log(error);
            seterrorModal(true)
            setpopupMessage(error.response.data.message)
        }
    }
    const removeDiscount = async (e) => {
        e.preventDefault()
        const discObj = {
            userId: user.id,
            postId: editPostObjHook.postId,
        }
        setsmallLoader(true)
        try {
            const res = await put('/post/removeDiscount', discObj)
            if (res) {
                setsmallLoader(false)
                console.log(res.data);
                setmodal(true)
                setpopupMessage("Discount removed Successfully")
            }

        } catch (error) {
            setsmallLoader(false)
            console.log(error);
            seterrorModal(true)
            setpopupMessage(error.response.data.message)
        }
    }


    return (
        <React.Fragment>
            {discountModal &&
                <>
                    <div className='scale-125 fixed top-0 left-0 right-0 bottom-0 ' style={{ background: "rgb(189, 189, 189, 0.9)" }}></div>
                    <form action="">
                        <div className='flex flex-col justify-center gap-y-2 fixed z-10 left-[50%] w-[90vw] top-[50%] transition duration-300 sm:w-[70vw] md:w-[50vw] bg-[white] rounded-lg shadow-lg py-4 px-4' style={{ transform: "translate(-50% , -50%)" }}>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-xl font-bold text-center'>Apply a Discount</h1>
                                <i className="fa-solid fa-xmark text-[20px] hover:bg-gray-200 p-2 rounded-full cursor-pointer hover:transition-all hover:duration-500" onClick={() => setdiscountModal(false)}></i>
                            </div>


                            <div className='flex w-full flex-col justify-between gap-5 mt-3 px-3'>
                                <h1 className='text-xl font-bold '>Price: {editPostObjHook.postPrice}$ </h1>

                                <div className='flex gap-x-3 items-center'>
                                    <h1 className='font-bold'>Discount % :</h1>
                                    <div className="relative mb-5">
                                        <input id="input-field" placeholder="Enter discount percentage" className="peer block py-1 text-base border-b-2 border-gray-300 bg-transparent outline-none transition-all duration-300 w-32 sm:w-full" type="number" value={discount} onChange={(e) => setdiscount(e.target.value)} />
                                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-700 transition-all duration-300 peer-focus:w-full"></span>
                                    </div>
                                </div>
                                <div className='flex flex-wrap gap-5 justify-center'>

                                    <div className='flex justify-center items-center w-40 gap-x-3 bg-rose-700 rounded-full hover:bg-rose-400   hover:text-rose-700 text-white cursor-pointer' onClick={removeDiscount}>
                                        {
                                            smallLoader ?
                                                <div className='py-1'>
                                                    <SmallLoader />
                                                </div> :
                                                <button className='px-4 py-2'>Remove Discount</button>

                                        }

                                    </div>
                                    <div className='flex justify-center items-center w-40 gap-x-3 bg-rose-700 rounded-full hover:bg-rose-400  hover:text-rose-700 text-white cursor-pointer' onClick={addDiscount}>
                                        {
                                            smallLoader ?
                                                <div className='py-1'>
                                                    <SmallLoader />
                                                </div> :
                                                <button className='px-6 py-2'>Add Discount</button>

                                        }

                                    </div>
                                </div>


                            </div>
                        </div>
                    </form>
                    {errorModal && popupMessage && <ErrorModal error="Discount Error" errormsg={popupMessage} />}
                    {modal && <Modal success modalMsg={popupMessage} btnText="Ok" click={() => setmodal(false)} />}
                </>}
        </React.Fragment>
    );
}
