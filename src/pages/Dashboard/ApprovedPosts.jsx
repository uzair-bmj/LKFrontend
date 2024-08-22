import React, { useContext, useEffect, useState } from 'react'
import DashboardNavbar from './DashboardNavbar'
import StyledButton from "../../components/StyledButton"
import { MyContext } from '../../context/MyContext'
import Postform from '../../components/Post/PostForm'
import Post from '../../components/Post/Post'
import { get, post, put, remove } from '../../api'
import { formatDistanceToNow } from 'date-fns'
import PostSuccess from '../../components/PostSuccess'
import Modal from "../../components/Modals/Modal"
import ErrorModal from '../../components/Modals/ErrorModal'
import EditPost from '../../components/Post/EditPost'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'


export default function ApprovedPosts() {
    const { PostForm, setPostForm, userId, setuserId, postSuccess, setpostSuccess, loader, setloader, smallLoader, setsmallLoader, modal, setmodal, postEditHook, setpostEditHook, editPostObjHook, seteditPostObjHook, errorModal, seterrorModal } = useContext(MyContext)
    const [popupMessage, setpopupMessage] = useState('')
    const [posts, setposts] = useState([]);
    const [commentInput, setcommentInput] = useState('');
    const [likeEvent, setlikeEvent] = useState();
    const { isSignedIn } = useUser()
    const nav = useNavigate()
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await post('/userPosts', { userId })
                const approvedPosts = res.data.posts.filter((posts) =>
                    posts.status.toLowerCase().includes('approved')
                )
                // console.log(approvedPosts);
                const sortedPosts = approvedPosts.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                // console.log(sortedPosts);
                setposts(sortedPosts)
            } catch (error) {
                console.log(error);

            }

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
            // console.log(res);

        } catch (error) {
            console.log(error);

        }
    }
    const closeModal = () => {
        setmodal(false)
        setloader(true)

    }

    const likeApost = async (index) => {
        try {
            const likeObj = {
                postid: posts[index]._id,
                userId
            };

            // Optimistic UI update
            const updatedPosts = [...posts];
            const userIndex = updatedPosts[index].likedBy.indexOf(userId);

            if (userIndex === -1) {
                updatedPosts[index].likes += 1;
                updatedPosts[index].likedBy.push(userId);
            } else {
                updatedPosts[index].likes -= 1;
                updatedPosts[index].likedBy.splice(userIndex, 1);
            }

            setposts(updatedPosts);

            const res = await put('/post/like', likeObj);
            // console.log(res);
        } catch (error) {
            console.log(error);
            // Rollback optimistic UI update in case of error
            const updatedPosts = [...posts];
            const userIndex = updatedPosts[index].likedBy.indexOf(userId);

            if (userIndex !== -1) {
                updatedPosts[index].likes -= 1;
                updatedPosts[index].likedBy.splice(userIndex, 1);
            } else {
                updatedPosts[index].likes += 1;
                updatedPosts[index].likedBy.push(userId);
            }

            setposts(updatedPosts);
        }
    };
    const comment = async (index) => {
        // console.log(commentInput);

        const commentObj = {
            userId,
            postid: posts[index]._id,
            commenttxt: commentInput
        };

        try {
            setsmallLoader(true);
            const res = await put('/comment/postComment', commentObj);
            if (res) {
                setsmallLoader(false)
            }
            const updatedPosts = [...posts];
            updatedPosts[index].comments = res.data.post.comments;
            setposts(updatedPosts);

            setcommentInput('');

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
    };
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
                <div className='flex flex-col sm:ml-[35vw] md:ml-[20vw] lg:ml-[8vw] gap-y-3 mt-2'>
                    <div className='flex flex-col justify-center items-center gap-y-5 gap-x-5 py-5 sm:mb-0 mb-14'>
                        <div className="flex flex-col sm:flex-row justify-center gap-x-40 items-center gap-y-5">
                            <h1 className='text-xl font-bold'>APPROVED POSTS</h1>
                            <StyledButton btnTxt="Create a Post" Class="border-2 border-rose-700 text-rose-700 before:bg-rose-700" click={() => setPostForm(true)} />
                        </div>

                        {postSuccess && <PostSuccess class="w-full" />}
                        <div className='flex flex-col justify-center items-center gap-y-5 gap-x-5 py-5 sm:mb-0 mb-14'>
                            {posts && posts.map((items, index) => {
                                const timeToDisplay = items.createdAt;
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
                                        changeevent={(e) => setcommentInput(e.target.value)}
                                        sendComment={() => comment(index)}
                                        changeeventforLike={(e) => setlikeEvent(e.target.value)}
                                        click={() => likeApost(index)}
                                    />
                                );
                            })}
                            {errorModal && popupMessage && <ErrorModal error="Error posting comment" errormsg={popupMessage} />}
                            {modal && <Modal modalMsg="Post Deleted Successfully" click={closeModal} success btnText="Ok" btnClass="" />}
                        </div>
                    </div>
                </div>
            </div>
            {PostForm && <Postform />}
            {postEditHook && <EditPost />}
        </React.Fragment>

    )
}
