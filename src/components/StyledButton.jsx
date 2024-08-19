import React from 'react'

export default function StyledButton({Class , btnTxt , click}) {
    return (
        <React.Fragment>
            <button
                className={`${Class} relative px-6 py-3  uppercase font-medium text-base transition-all duration-300 overflow-hidden bg-transparent rounded-full before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:h-[300%] before:w-0 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45  before:z-[-1] before:transition-all before:duration-500 before:ease-in-out hover:text-white hover:before:w-full`}
                onClick={click}
            >
                {btnTxt}
            </button>
        </React.Fragment>
    )
}
