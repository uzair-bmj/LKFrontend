import React, { useContext, useState } from 'react';
import BuyNowBtn from './PostComponents/BuyNowBtn';
import LikeBtn from './PostComponents/LikeBtn';
import SaveBtn from './PostComponents/SaveBtn';
import StyledInput from './PostComponents/StyledInput';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { formatDistanceToNow } from 'date-fns';
import { MyContext } from '../../context/MyContext';
import SmallLoader from '../Loaders/SmallLoader';
import StripeCheckout from 'react-stripe-checkout';
import { post } from '../../api'
import { useUser } from '@clerk/clerk-react';

export default function Post({
    userName,
    avatar,
    postTime,
    Name,
    caption,
    postImgUrl,
    postLikes,
    comments,
    price,
    Class,
    dropdown,
    imgClass,
    imageClass,
    click,
    changeevent,
    sendComment,
    editPost,
    deletePost,
    changeeventforLike,
    clickToBuy
}) {
    const [toggelHide, setToggelHide] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const { smallLoader, userAvatar, setuserAvatar } = useContext(MyContext);
    const [btnTxt, setBtnTxt] = useState("see more");
    const [showCommentSection, setshowCommentSection] = useState(false)

    function seeMore() {
        setToggelHide(!toggelHide);
        setBtnTxt(toggelHide ? "See more" : "See less");
    }

    function toggleComments() {
        setShowAllComments(!showAllComments);
    }

    function toggleCommentSection() {
        setshowCommentSection(!showCommentSection);
    }

    // Prevent double triggering of the click event
    const handleLikeClick = (e) => {
        e.stopPropagation(); // Prevents event bubbling
        e.preventDefault(); // Prevents default behavior
        click(); // Calls the passed click handler
    };



    return (
        <React.Fragment>
            <div className={`${Class} flex flex-col bg-white max-w-2xl px-5 py-5 rounded-lg gap-y-3`}>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-x-3'>
                        <img src={avatar} alt="" className={`w-12 h-12 rounded-full`} />
                        <div>
                            <h1 className='font-medium text-lg '>{userName}</h1>
                            <h1 className='text-xs text-gray-400'>{postTime}</h1>
                        </div>
                    </div>
                    <div className='flex gap-x-3 items-center'>
                        {
                            smallLoader ?
                                <div className='py-1'>
                                    <SmallLoader />
                                </div> :
                                <BuyNowBtn price={price} buynowClick={clickToBuy} />

                        }
                        {dropdown && (
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        <i className="fa-solid fa-ellipsis-vertical text-md"></i>
                                    </MenuButton>
                                </div>

                                <MenuItems
                                    transition
                                    className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <div className='flex justify-between items-center cursor-pointer px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900' onClick={editPost}>
                                                <a href="#" className="" >
                                                    Edit Post
                                                </a>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </div>
                                        </MenuItem>

                                        <MenuItem>
                                            <div className='flex justify-between items-center cursor-pointer px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900' onClick={deletePost}>
                                                <a href="#" className="" >
                                                    Delete Post
                                                </a>
                                                <i className="fa-solid fa-trash"></i>
                                            </div>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        )}
                    </div>
                </div>

                <div>
                    <h1 className='text-xl font-semibold'>{Name}:</h1>
                    <h1 className='text-sm w-[600px] break-words'>{!toggelHide ? caption.slice(0, 70) : caption}</h1>
                    <button onClick={seeMore} className='text-sm'>{btnTxt}</button>
                </div>

                <div className={`${imgClass} w-[600px] h-96 mx-auto aspect-w-1 aspect-h-1 sm:aspect-w-4 sm:aspect-h-3`}>
                    <img src={postImgUrl} alt="" className={`${imageClass} object-cover w-full h-full rounded-lg`} />
                </div>

                <div className='flex justify-between items-center'>
                    <div className='flex gap-x-3 items-center'>
                        <div>
                            <label className="container" onClick={handleLikeClick}>
                                <input type="checkbox" onChange={changeeventforLike} />
                                <div className="checkmark">
                                    <svg viewBox="0 0 256 256 ">
                                        <rect fill="none" height="256" width="256"></rect>
                                        <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#FFF" fill="none"></path>
                                    </svg>
                                </div>
                            </label>
                        </div>
                        <div>
                            <i className="fa-regular fa-comment text-[21px] text-gray-400 cursor-pointer hover:text-rose-700 mt-1 hover:scale-110 hover:transition-all hover:duration-300" onClick={toggleCommentSection}></i>
                        </div>
                    </div>
                    <div>
                        <h1 className='text-sm cursor-pointer' onClick={toggleComments}>
                            {showAllComments ? "Hide Comments" : `View All ${comments.length} Comments`}
                        </h1>
                    </div>
                </div>

                <div>
                    <h1 className='font-medium'>{postLikes || 0} likes</h1>
                </div>


                {smallLoader ? (
                    <SmallLoader />
                ) : (
                    <>
                        {comments.length > 0 && (
                            <>
                                {showAllComments
                                    ? comments.map((comment, index) => (
                                        <div className='flex items-center justify-between' key={index}>
                                            <div className='flex items-center gap-x-3'>
                                                <img src={comment.userAvatar} alt="" className={`w-6 h-6 rounded-full`} />
                                                <h1 className='font-bold text-sm'>{comment.userName}</h1>
                                                <h1 className='text-sm' id='comment'>{comment.commenttxt}</h1>
                                            </div>
                                            <div>
                                                <h1 className='text-xs text-gray-400'>
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </h1>
                                            </div>
                                        </div>
                                    ))
                                    : (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-x-3'>
                                                <img src={comments[0].userAvatar} alt="" className={`w-6 h-6 rounded-full`} />
                                                <h1 className='font-bold text-sm'>{comments[0].userName}</h1>
                                                <h1 className='text-sm' id='comment'>{comments[0].commenttxt}</h1>
                                            </div>
                                            <div>
                                                <h1 className='text-xs text-gray-400'>
                                                    {formatDistanceToNow(new Date(comments[0].createdAt), { addSuffix: true })}
                                                </h1>
                                            </div>
                                        </div>
                                    )}
                            </>
                        )}
                    </>
                )}

                {
                    showCommentSection ?

                        <div className={`flex items-center gap-x-3 ${showCommentSection ? "translate-y-0" : "-translate-y-full"}`}>
                            <img src={userAvatar} alt="" className={`w-6 h-6 rounded-full`} />
                            <StyledInput placeholder="Write a comment..." type="text" onchange={changeevent} click={sendComment} />
                            {/* <i className="fa-solid fa-paper-plane text-rose-700 cursor-pointer" onClick={sendComment}></i> */}
                        </div>
                        : null
                }

            </div>
        </React.Fragment>
    );
}
