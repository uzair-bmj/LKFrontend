import React, { createContext, useEffect, useState } from 'react';

const MyContext = createContext();

export default function MyContextProvider({ children }) {
    const [loader, setloader] = useState(false);
    const [PostForm, setPostForm] = useState(false)
    const [smallLoader, setsmallLoader] = useState(false)
    const [errorModal, seterrorModal] = useState(false)
    const [postSuccess, setpostSuccess] = useState(false)
    const [modal, setmodal] = useState(false)
    const [discountModal, setdiscountModal] = useState(false)
    const [totalEarnings, settotalEarnings] = useState()
    const [userId, setuserId] = useState(localStorage.getItem('userId') || "");
    const [userAvatar, setuserAvatar] = useState(localStorage.getItem('userAvatar') || "");
    const [userName, setuserName] = useState(localStorage.getItem('userName') || "");
    const [postEditHook, setpostEditHook] = useState(false)
    const [editPostObjHook, seteditPostObjHook] = useState(JSON.parse(localStorage.getItem('editPostObjHook')) || {});


    useEffect(() => {
        localStorage.setItem('userId', userId)
    }, [userId])
    useEffect(() => {
        localStorage.setItem('userAvatar', userAvatar)
    }, [userAvatar])
    useEffect(() => {
        localStorage.setItem('userName', userName)
    }, [userName])
    useEffect(() => {
        localStorage.setItem('editPostObjHook', JSON.stringify(editPostObjHook));
    }, [editPostObjHook]);
    useEffect(() => {
        const storeduserId = localStorage.getItem('userId')
        const storeduserAvatar = localStorage.getItem('userAvatar')
        const storeduserName = localStorage.getItem('userName')
        const storededitPostObjHook = localStorage.getItem('editPostObjHook')

        if (storeduserId) setuserId(storeduserId)
        if (storeduserAvatar) setuserAvatar(storeduserAvatar)
        if (storeduserName) setuserName(storeduserName)
        if (storededitPostObjHook) seteditPostObjHook(JSON.parse(storededitPostObjHook));

    }, [])

    return (
        <MyContext.Provider value={{ loader, setloader, PostForm, setPostForm, userId, setuserId, smallLoader, setsmallLoader, errorModal, seterrorModal, postSuccess, setpostSuccess, userAvatar, setuserAvatar, userName, setuserName, modal, setmodal, postEditHook, setpostEditHook, editPostObjHook, seteditPostObjHook, totalEarnings, settotalEarnings, discountModal, setdiscountModal }}>
            {children}
        </MyContext.Provider>
    );
}

export { MyContext };
