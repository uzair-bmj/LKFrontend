import React, { useContext, useEffect, useState } from 'react';
import AdminDashboardNavbar from './AdminDashboardNavbar';
import { useUser } from '@clerk/clerk-react';
import StyledButton from '../../components/StyledButton';
import { useLocation, useNavigate } from 'react-router-dom';
import Postform from '../../components/Post/PostForm';
import { MyContext } from '../../context/MyContext';
import { get, put } from '../../api';
import ErrorModal from '../../components/Modals/ErrorModal';
import Modal from '../../components/Modals/Modal';

export default function AdminDashboard() {
  const { loader, setloader, PostForm, setPostForm, errorModal, seterrorModal, setmodal, modal } = useContext(MyContext)
  const [posts, setposts] = useState([]);
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [popupMessage, setpopupMessage] = useState('')
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [modalmsg, setmodalmsg] = useState('')

  useEffect(() => {
    // If the user does not have the admin role, redirect them to the home page
    if (user?.publicMetadata.role !== 'admin') {
      navigate('/');
    }
    if (!isSignedIn) {
      navigate('/')
    }
    const fetchPosts = async () => {
      try {
        const res = await get('/post');
        // console.log(res);

        const pendingPosts = res.data.posts.filter((item) =>
          item.status.toLowerCase().includes("pending")
        );
        const sortedPosts = pendingPosts.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log(sortedPosts);

        setposts(sortedPosts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [user, navigate, isSignedIn]);

  const [toggleHide, setToggleHide] = useState(posts.map(() => false));

  const toggleHandle = (index) => {
    setToggleHide(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const handleCheckboxChange = (e, postId) => {
    if (e.target.checked) {
      setSelectedPostIds((prev) => [...prev, postId]); // Add postId to array
    } else {
      setSelectedPostIds((prev) => prev.filter((id) => id !== postId)); // Remove postId from array
    }
    // console.log(selectedPostIds);

  };
  const approvePost = async () => {
    const statusObj = {
      postIds: selectedPostIds,
      emails: posts.map(post => post.userDetails.email),
      status: "approved"
    }
    console.log(statusObj);
    
    setloader(true)
    try {
      const res = await put('/post/statusUpdate', statusObj)
      // console.log(res);
      setSelectedPostIds([])
      setloader(false)
      if (res) {
        setmodal(true)
      }
    } catch (error) {
      console.log(error);
      setloader(false)
      seterrorModal(true);
      setpopupMessage(error.response.data.message);

    }
  }
  const rejectPost = async () => {
    const statusObj = {
      postIds: selectedPostIds,
      status: "rejected"
    }
    setloader(true)
    try {
      const res = await put('/post/statusUpdate', statusObj)
      // console.log(res);
      setSelectedPostIds([])
      setloader(false)
      if (res) {
        setmodal(true)
      }
    } catch (error) {
      console.log(error);
      console.log(error);
      setloader(false)
      seterrorModal(true);
      setpopupMessage(error.response.data.message);
    }
  }

  return (
    <React.Fragment>
      <div className='grid grid-cols-[auto,1fr] h-screen'>
        <AdminDashboardNavbar />
        <div className='flex flex-col justify-center items-center sm:ml-[10vw] md:ml-[8vw] lg:ml-[2vw] gap-y-5 py-5'>
          <div className='flex flex-col md:flex-row gap-4 justify-between items-center w-full'>
            <h1 className='text-2xl font-bold text-center'>Posts Pending for Approval</h1>
            <div className='flex gap-x-5'>
              <StyledButton btnTxt="Reject" Class="border-2 border-rose-700 text-rose-700 before:bg-rose-700" click={rejectPost} />
              <StyledButton btnTxt="Approve" Class="border-2 border-green-700 text-green-700 before:bg-green-700" click={approvePost} />
            </div>

          </div>
          <div>
            <div className="bg-white shadow-md rounded-lg lg:w-full h-screen sm:w-[60vw] w-[80vw] overflow-y-scroll sm:mb-5 mb-24">
              <div className='lg:block hidden'>
                <div className="grid grid-cols-5 w-full gap-4 py-4 px-6 bg-rose-700 lg:grid-cols-5 lg:gap-x-32">
                  <h3 className="text-xs md:text-lg font-medium text-white flex-grow">User</h3>
                  <h3 className="text-xs md:text-lg font-medium text-white flex-grow">Name</h3>
                  <h3 className="text-xs md:text-lg font-medium text-white flex-grow sm:block hidden">caption</h3>
                  <h3 className="text-xs md:text-lg font-medium text-white flex-grow">Image</h3>
                  <h3 className="text-xs md:text-lg font-medium text-white">Price</h3>
                </div>
              </div>

              {posts.map((items, index) => (
                <div className="border-t border-gray-200 odd:bg-gray-200 relative" key={index}>
                  <div className="lg:grid flex flex-col gap-y-5 grid-cols-5 w-full items-center gap-x-20 sm:gap-x-4 lg:gap-x-32 py-4 px-6">
                    <div className="flex justify-between gap-x-5 w-full items-center sm:mb-4 ">
                      <p className="text-xs font-medium lg:hidden block text-gray-500">user:</p>
                      <div className="flex gap-2 items-center ">
                        <input type="checkbox" onChange={(e) => handleCheckboxChange(e, items._id)}
                          checked={selectedPostIds.includes(items._id)} className='cursor-pointer lg:block hidden' />
                        <img
                          src={items.userDetails.avatarUrl}
                          alt=""
                          className="w-6 h-6 rounded-full sm:block hidden"
                        />
                        <h1 className="text-xs md:text-lg font-medium text-gray-800 flex-grow">
                          {items.userDetails.userName}
                        </h1>
                      </div>
                    </div>
                    <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                      <p className="text-xs lg:hidden block font-medium text-gray-500">Product Name:</p>
                      <h2>{items.productName}</h2>
                    </div>
                    <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                      <p className="text-xs lg:hidden block font-medium text-gray-500">Caption:</p>
                      <div>
                        <h2 className="text-xs sm:ms-0 -ms-5 w-40 overflow-hidden">
                          {`${!toggleHide[index] ? items.caption.slice(0, 15) : items.caption}`}
                        </h2>
                        <button
                          onClick={() => toggleHandle(index)}
                          className="text-xs"
                        >
                          {toggleHide[index] ? "See less" : "See more"}
                        </button>
                      </div>
                    </div>
                    <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                      <p className="text-xs lg:hidden block font-medium text-gray-500">Product Image:</p>
                      <img
                        src={items.postImage}
                        className="w-[20vw] sm:w-10 h-20 sm:h-10"
                        alt=""
                      />
                    </div>
                    <div className="sm:mb-4 flex justify-between  gap-x-5 w-full items-center">
                      <p className="text-xs lg:hidden block font-medium text-gray-500">Price:</p>
                      <h1 className="text-xs md:text-lg font-medium text-gray-800">
                        {items.price}
                      </h1>
                    </div>
                    <input type="checkbox" onChange={(e) => handleCheckboxChange(e, items._id)}
                      checked={selectedPostIds.includes(items._id)} className='cursor-pointer lg:hidden absolute top-2 left-2 block' />

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
      {errorModal && popupMessage && <ErrorModal error="Error Updating posts" errormsg={popupMessage} />}
      {modal && <Modal modalMsg="Status Updated Successfully" click={() => setmodal(false)} success btnText="Ok" btnClass="" />}
      {PostForm && <Postform />}
    </React.Fragment>
  );
}
