import React, { useContext } from 'react'
import { MyContext } from '../context/MyContext'

export default function PostSuccess(props) {
    const { postSuccess, setpostSuccess } = useContext(MyContext)

    return (
        <React.Fragment>
            {
                postSuccess &&
                <>
                    <div className={`${props.class} bg-rose-400 px-4 py-3 rounded-xl flex justify-between items-center`}>
                        <div>
                            <h1 className='text-white text-xs'>Your Post is sent for approval. you will be notified about the status at your gmail</h1>
                        </div>
                        <div>
                            <i className="fa-solid fa-xmark text-[20px] text-white hover:text-rose-700  p-1  cursor-pointer hover:transition-all hover:duration-500" onClick={() => setpostSuccess(false)}></i>
                        </div>

                    </div>
                </>
            }
        </React.Fragment>
    )
}
