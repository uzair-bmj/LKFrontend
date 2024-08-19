import React, { useContext } from 'react'


export default function StyledInput(props) {
    return (
        <>
            <div class="relative w-full">
                <input type="text" id="input" placeholder='Write a comment' required class="peer text-lg w-full border-none border-b-2 border-gray-300 bg-transparent p-1 focus:outline-none focus:border-gray-600" onChange={props.onchange} />
                <i className="fa-solid fa-paper-plane absolute top-2 right-2 text-rose-700 cursor-pointer" onClick={props.click}></i>
                <div class="absolute bottom-0 left-0 h-0.5 w-full bg-rose-700 scale-x-0 transition-transform duration-300 peer-focus:scale-x-100 peer-valid:scale-x-100"></div>
            </div>
        </>
    )
}
