import React, { useContext, useEffect } from 'react';
import "./Loader.css";
import { MyContext } from '../../context/MyContext';

export default function Spinner() {
    const { loader, setloader } = useContext(MyContext);

    useEffect(() => {
        setloader(true);
        setTimeout(() => {
            setloader(false);
        }, 2000);
    }, [loader, setloader]);

    return (
        <React.Fragment>
            {loader ?
                <div class="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div> : null
            }
        </React.Fragment>
    );
}
