import React, { useContext, useEffect } from 'react'
import "./smallLoader.css"
import { MyContext } from '../../context/MyContext'

export default function SmallLoader({Class}) {
    const { smallLoader, setsmallLoader } = useContext(MyContext)

    return (
        <React.Fragment>
            {
                smallLoader ?
                    <>
                        <div className={` loader`}>
                            <div className={`${Class} bar bar1`}></div>
                            <div className={`${Class} bar bar2`}></div>
                            <div className={`${Class} bar bar3`}></div>
                            <div className={`${Class} bar bar4`}></div>
                            <div className={`${Class} bar bar5`}></div>
                            <div className={`${Class} bar bar6`}></div>
                            <div className={`${Class} bar bar7`}></div>
                            <div className={`${Class} bar bar8`}></div>
                            <div className={`${Class} bar bar9`}></div>
                            <div className={`${Class} bar bar10`}></div>
                            <div className={`${Class} bar bar11`}></div>
                            <div className={`${Class} bar bar12`}></div>
                        </div>
                    </> : null
            }


        </React.Fragment>
    )
}
