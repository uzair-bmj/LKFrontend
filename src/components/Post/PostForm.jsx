import React, { useContext, useState } from 'react';
import { MyContext } from '../../context/MyContext';
import Button from '../Button';
import { post } from "../../api";
import SmallLoader from '../Loaders/SmallLoader';
import ErrorModal from '../Modals/ErrorModal';
import { useUser } from '@clerk/clerk-react';

export default function Postform() {
    const { PostForm, setPostForm, userId, smallLoader, setsmallLoader, errorModal, seterrorModal, postSuccess, setpostSuccess } = useContext(MyContext);
    const [popupMessage, setpopupMessage] = useState('')
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [price, setPrice] = useState('');
    const [productName, setProductName] = useState('');
    const { isSignedIn } = useUser()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const createPost = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('caption', caption);
        formData.append('productName', productName);
        formData.append('postImage', image);
        formData.append('price', price);

        try {
            setsmallLoader(true)
            const res = await post('/post', formData);
            if (res) {
                setsmallLoader(false)
            }
            console.log(res.data);
            setPostForm(false);
            setpostSuccess(true)
            setTimeout(() => {
                setpostSuccess(false)
            }, 5000)
        } catch (error) {
            setsmallLoader(false)
            console.log(error.response.data.message);
            if (error.response.data.message === "No user found") {
                setsmallLoader(false)
                seterrorModal(true)
                setpopupMessage("Login first")
            } else {
                setsmallLoader(false)
                seterrorModal(true)
                setpopupMessage(error.response.data.message)
            }


        }

    };



    return (
        <React.Fragment>
            {PostForm &&
                <>
                    <div className='scale-125 fixed top-0 left-0 right-0 bottom-0 ' onClick={() => setPostForm(false)} style={{ background: "rgb(189, 189, 189, 0.9)" }}></div>
                    <form action="" onSubmit={createPost}>
                        <div className='flex flex-col justify-center gap-y-2 fixed z-10 left-[50%] w-[90vw] top-[50%] transition duration-300 sm:w-[50vw] bg-[white] rounded-lg shadow-lg py-4 px-4' style={{ transform: "translate(-50% , -50%)" }}>
                            <div className='flex justify-between items-center'>
                                <p></p>
                                <h1 className='text-xl font-bold text-center'>Create a Post</h1>
                                <i className="fa-solid fa-xmark text-[20px] hover:bg-gray-200 p-2 rounded-full cursor-pointer hover:transition-all hover:duration-500" onClick={() => setPostForm(false)}></i>
                            </div>
                            <div className='flex items-center justify-between mt-3 px-3'>
                                <div className='flex gap-x-3 items-center'>
                                    <h1 className='font-bold'>Product Name :</h1>
                                    <div className="relative mb-5">
                                        <input id="input-field" required placeholder="Enter a Product Name" className="peer block py-1 text-base border-b-2 border-gray-300 bg-transparent outline-none transition-all duration-300 w-full" type="text" onChange={(e) => setProductName(e.target.value)} />
                                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-700 transition-all duration-300 peer-focus:w-full"></span>
                                    </div>
                                </div>
                            </div>
                            <textarea name="" rows="5" required placeholder='Tell us something about product' className='p-3' id="" onChange={(e) => setCaption(e.target.value)}></textarea>

                            <div className='flex items-center justify-center'>
                                <label htmlFor="file" className="flex flex-col items-center justify-center w-[300px] h-[200px] gap-5 cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg shadow-[0px_48px_35px_-48px_rgba(232,232,232,0.6)]">
                                    <div className="flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="h-20 fill-gray-300" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="font-normal text-gray-300">Click to upload image</span>
                                    </div>
                                    <input id="file" type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                                {imagePreview && (
                                    <div className="w-full flex justify-center">
                                        <img src={imagePreview} alt="Preview" className="w-[300px] h-[200px] object-cover rounded-lg shadow-lg" />
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center justify-between mt-3 px-3'>
                                <div className='flex gap-x-3 items-center'>
                                    <h1 className='font-bold'>Price :</h1>
                                    <div className="relative mb-5">
                                        <input id="input-field" required placeholder="Enter Price in usd" className="peer block py-1 text-base border-b-2 border-gray-300 bg-transparent outline-none transition-all duration-300 w-full" type="number" onChange={(e) => setPrice(e.target.value)} />
                                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-rose-700 transition-all duration-300 peer-focus:w-full"></span>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center w-32 gap-x-3 bg-rose-700 rounded-full hover:bg-rose-400  hover:text-rose-700 text-white cursor-pointer' onClick={createPost}>
                                    {
                                        smallLoader ?
                                            <div className='py-1'>
                                                <SmallLoader />
                                            </div> :
                                            <button className='px-4 py-2'>Post</button>

                                    }
                                    {/* <div className='-ms-4'>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </form>
                    {errorModal && popupMessage && <ErrorModal error="Post Creation Error" errormsg={popupMessage} />}
                </>}
        </React.Fragment>
    );
}
