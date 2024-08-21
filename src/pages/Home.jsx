import React, { useContext, useEffect, useState } from 'react';
import TopNavbar from './Navbar/TopNavbar';
import { MyContext } from '../context/MyContext';
import Post from '../components/Post/Post';
import Postform from '../components/Post/PostForm';
import { get, post, put } from '../api';
import { formatDistanceToNow } from 'date-fns';
import PostSuccess from '../components/PostSuccess';
import StyledInput from '../components/Post/PostComponents/StyledInput';
import ErrorModal from '../components/Modals/ErrorModal';
import { useUser } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';


export default function Home() {
    const { PostForm, postSuccess, userId, smallLoader, setsmallLoader, errorModal, seterrorModal } = useContext(MyContext);
    const [popupMessage, setpopupMessage] = useState('');
    const [error, seterror] = useState('');
    const [posts, setposts] = useState([]);
    const [commentInput, setcommentInput] = useState('');
    const [likeEvent, setlikeEvent] = useState();
    const { isSignedIn, user } = useUser()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await get('/post');
                const approvedPosts = res.data.posts.filter((item) =>
                    item.status.toLowerCase().includes("approved")
                );
                const sortedPosts = approvedPosts.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                console.log(sortedPosts);

                setposts(sortedPosts);
            } catch (error) {
                console.log(error);
            }
        };


        fetchPosts();
    }, []);

    const likeApost = async (index) => {
        if (isSignedIn) {
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
                console.log(res);
            } catch (error) {
                console.log(error.response.data.message);
                // if (error.response.data.message === "No user found") {
                //     seterrorModal(true)
                //     setsmallLoader(false)
                //     setpopupMessage("Login first")
                // } else {
                //     seterrorModal(true)
                //     setsmallLoader(false)
                //     setpopupMessage(error.response.data.message)
                // }

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
        } else {
            seterrorModal(true)
            seterror("Authentication error")
            setpopupMessage("please login first")
        }

    };

    const comment = async (index) => {
        console.log(commentInput);

        const commentObj = {
            userId,
            postid: posts[index]._id,
            commenttxt: commentInput
        };

        try {
            setsmallLoader(true);
            const res = await put('/comment/postComment', commentObj);
            setsmallLoader(false);

            const updatedPosts = [...posts];
            updatedPosts[index].comments = res.data.post.comments;
            setposts(updatedPosts);

            setcommentInput('');
        } catch (error) {
            console.log(error.response.data.message);
            if (error.response.data.message === "No user found") {
                seterrorModal(true)
                setsmallLoader(false)
                seterror("Error Posting Comment")
                setpopupMessage("Login first")
            } else {
                seterrorModal(true)
                setsmallLoader(false)
                seterror("Error Posting Comment")
                setpopupMessage(error.response.data.message)
            }
        }

    };



    const makePayment = async (index) => {
        if (isSignedIn) {
            try {
                setsmallLoader(true)
                const stripe = await loadStripe('pk_test_51Po9d2Ru0YYBHVZZWRMVQtARW4II5YaBpHoIU3nRbOC7c0NbeY5TJJFXiYhQJY70g9FGRfjXvZ8K6gJLtHZY0XH70093BJCJDK');
                const body = {
                    name: posts[index].productName,
                    details: posts[index].caption,
                    productImage: posts[index].postImage,
                    price: posts[index].price,
                    productBy: posts[index].userName,
                    user: {
                        id: user.id,
                        post: posts[index]._id,
                        email: user.emailAddresses[0].emailAddress,
                        userAvatar: user.imageUrl,
                        name: user.username
                    }
                };
                const headers = {
                    "content-type": "application/json"
                };

                const response = await fetch("http://localhost:5000/api/create-checkout-session", {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body)
                });
                const session = await response.json();
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id
                });
                setsmallLoader(false)
                if (result.error) {
                    console.log(result.error.message);
                }
            } catch (error) {
                setsmallLoader(false)
                console.log(error);

            }
        } else {
            seterrorModal(true)
            seterror("Checkout Error")
            setpopupMessage("Please Login First")
        }
    };

    




    return (
        <React.Fragment>
            <div className='flex flex-col sm:justify-center sm:items-center gap-y-5 mb-16 '>
                <div className='sm:w-[60vw] lg:max-w-2xl w-full'>
                    <TopNavbar />
                </div>
                {postSuccess && <PostSuccess class="sm:w-[60vw] w-full lg:max-w-2xl" />}
                <div className='flex flex-col justify-center  items-center gap-5 '>
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
                                Name={items.productName}
                                caption={items.caption}
                                postImgUrl={items.postImage}
                                postLikes={items.likes}
                                comments={sortedComments}
                                changeeventforLike={(e) => setlikeEvent(e.target.value)}
                                price={items.price}
                                click={() => likeApost(index)}
                                changeevent={(e) => setcommentInput(e.target.value)}
                                sendComment={() => comment(index)}
                                clickToBuy={() => makePayment(index)}
                            />
                        );
                    })

                    }
                    {errorModal && popupMessage && <ErrorModal error={error} errormsg={popupMessage} />}
                </div>
            </div>
            {PostForm && <Postform />}
        </React.Fragment>
    );
}
