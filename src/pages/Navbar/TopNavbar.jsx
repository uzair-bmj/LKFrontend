import React, { useContext, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { MyContext } from '../../context/MyContext'
import StyledButton from '../../components/StyledButton';
import ErrorModal from '../../components/Modals/ErrorModal';

export default function TopNavbar() {
    const { PostForm, setPostForm, userId, setuserId, userAvatar, setuserAvatar, userName, setuserName, errorModal, seterrorModal } = useContext(MyContext);
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        if (user) {
            // console.log('User data:', user);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userAvatar', user.imageUrl);
            localStorage.setItem('userName', user.username);

            setuserId(user.id);
            setuserAvatar(user.imageUrl);
            setuserName(user.username);
        }
    }, [user, setuserId, setuserAvatar, setuserName]);

    useEffect(() => {
        if (!user) {
            localStorage.removeItem('userId');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userName');
        }
    }, [user]);

    const openPostForm = () => {
        if (isSignedIn) {
            setPostForm(true)
        } else {
            seterrorModal(true)
        }
    }

    return (
        <React.Fragment>
            <div className='flex justify-between items-center w-full'>
                <div>
                    <StyledButton btnTxt="Create a Post" Class="border-2 border-rose-700 text-rose-700 before:bg-rose-700" click={openPostForm} />
                </div>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton>
                            <button className="relative px-6 py-2 border-2 border-rose-700 text-rose-700 uppercase font-medium text-base transition-all duration-300 overflow-hidden bg-transparent rounded-full before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:h-[300%] before:w-0 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-rose-700 before:z-[-1] before:transition-all before:duration-500 before:ease-in-out hover:text-white hover:before:w-full">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: 'h-10 w-10 shadow-lg',
                                    userButtonAvatarImage: 'h-10 w-10 shadow-lg',
                                    userButtonTrigger: 'h-10 w-10 shadow-lg',
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
            {errorModal && <ErrorModal   error="Authentication Error" errormsg="Please Login first" />}

        </React.Fragment>
    );
}
