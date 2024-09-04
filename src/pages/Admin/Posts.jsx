import React, { useContext, useEffect, useState } from 'react'
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
import AdminDashboardNavbar from './AdminDashboardNavbar'


export default function Posts() {
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
                const res = await get('/post')
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
        const delObj = {
            postid: posts[index]._id
        }
        setloader(true)
        try {
            const res = await put('/post/deletePost', delObj)
            // console.log(res);
            setloader(false)
            if (res) {
                setmodal(true)
            }
        } catch (error) {
            setloader(false)
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
                <AdminDashboardNavbar />
                <div className='flex flex-col justify-center items-center sm:ml-[10vw] md:ml-[8vw] lg:ml-[2vw] gap-y-5 py-5'>
                    <div className='flex flex-col justify-center items-center gap-y-5 gap-x-5 py-5 sm:mb-0 mb-14'>
                        <div className="text-center">
                            <h1 className='text-xl font-bold'>POSTS</h1>

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
                                        userName={items.userDetails.userName}
                                        avatar={items.userDetails.avatarUrl}
                                        postTime={formatDistanceToNow(new Date(timeToDisplay), { addSuffix: true })}
                                        caption={items.caption}
                                        Name={items.productName}
                                        postImgUrl={items.postImage}
                                        deleteButton
                                        postLikes={items.likes}
                                        comments={sortedComments}
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
