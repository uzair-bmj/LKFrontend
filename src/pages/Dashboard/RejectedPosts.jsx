import React, { useContext, useEffect, useState } from 'react'
import DashboardNavbar from './DashboardNavbar'
import StyledButton from "../../components/StyledButton"
import { MyContext } from '../../context/MyContext'
import Postform from '../../components/Post/PostForm'
import Post from '../../components/Post/Post'
import { formatDistanceToNow } from 'date-fns'
import { post, put } from '../../api'
import Modal from '../../components/Modals/Modal'
import ErrorModal from '../../components/Modals/ErrorModal'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import EditPost from '../../components/Post/EditPost'
import PostSuccess from '../../components/PostSuccess'


export default function RejectedPosts() {
    const { PostForm, setPostForm, userId, setuserId, postSuccess, setpostSuccess, loader, setloader, smallLoader, setsmallLoader, modal, setmodal, postEditHook, setpostEditHook, editPostObjHook, seteditPostObjHook, errorModal, seterrorModal } = useContext(MyContext)
    const [posts, setPosts] = useState([])
    const [popupMessage, setpopupMessage] = useState('')
    const { isSignedIn } = useUser()
    const nav = useNavigate()
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await post('/userPosts', { userId })
            const rejectedPosts = res.data.posts.filter((posts) =>
                posts.status.toLowerCase().includes('rejected')
            )
            console.log(rejectedPosts);
            const sortedPosts = rejectedPosts.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            console.log(sortedPosts);
            setPosts(sortedPosts)

        }
        fetchPosts()
        if (!isSignedIn) {
            nav('/')
        }
    }, [posts, postEditHook, postSuccess, isSignedIn])

    const delPost = async (index) => {
        setmodal(true)
        const delObj = {
            postid: posts[index]._id
        }
        try {
            const res = await put('/post/deletePost', delObj)
            console.log(res);

        } catch (error) {
            console.log(error.response.data.message);
            if (error.response.data.message === "No user found") {
                seterrorModal(true)
                setsmallLoader(false)
                setpopupMessage("Login first")
            } else {
                seterrorModal(true)
                setsmallLoader(false)
                setpopupMessage(error.response.data.message)
            }



        }
    }
    const closeModal = () => {
        setmodal(false)
        setloader(true)

    }
    const openEditPostModal = (index) => {
        const editPostObj = {
            postId: posts[index]._id,
            postCaption: posts[index].caption,
            productName: posts[index].productName,
            postImage: posts[index].postImage,
            postPrice: posts[index].price
        }
        seteditPostObjHook(editPostObj)
        // console.log(editPostObjHook);
        setpostEditHook(true)

    }
    return (
        <React.Fragment>
            <div className='grid grid-cols-[auto,1fr] h-screen'>
                <DashboardNavbar />
                <div className='flex flex-col  sm:ml-[35vw] md:ml-[20vw] lg:ml-[8vw] gap-y-3 mt-2'>
                    <div className='flex flex-col justify-center items-center gap-y-5 gap-x-5 py-5 sm:mb-0 mb-14'>
                        <h1 className='text-xl font-bold'>REJECTED POSTS</h1>
                        {postSuccess && <PostSuccess class="w-full" />}

                        {posts && posts.map((items, index) => {
                            // Determine whether to show the created time or the last edited time
                            const timeToDisplay = items.updatedAt ? items.updatedAt : items.createdAt;
                            const sortedComments = items.comments.sort((a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                            );

                            return (
                                <Post
                                    key={index}
                                    userName={items.userName}
                                    avatar={items.userAvatar}
                                    postTime={formatDistanceToNow(new Date(timeToDisplay), { addSuffix: true })}
                                    caption={items.caption}
                                    Name={items.productName}
                                    postImgUrl={items.postImage}
                                    postLikes={items.likes}
                                    comments={sortedComments}
                                    dropdown
                                    imgClass=""
                                    imageClass="object-cover"
                                    Class="overflow-x-hidden"
                                    deletePost={() => delPost(index)}
                                    editPost={() => openEditPostModal(index)}
                                />
                            );
                        })}
                        {errorModal && popupMessage && <ErrorModal error="Error posting comment" errormsg={popupMessage} />}
                        {modal && <Modal modalMsg="Post Deleted Successfully" click={closeModal} success btnText="Ok" btnClass="" />}
                    </div>
                </div>
            </div>
            {PostForm && <Postform />}
            {postEditHook && <EditPost />}
        </React.Fragment>
    )
}
