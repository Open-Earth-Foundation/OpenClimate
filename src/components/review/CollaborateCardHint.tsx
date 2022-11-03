import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ArrowDownward } from "@mui/icons-material";

const CollaborationCardHint = () => {
    const [hasReadHint, setHasReadHint] =  useState<boolean>(true)
    
    const setCollabCookieValue = (e: any) => {
        e.preventDefault();
        setHasReadHint(false)
        localStorage.setItem("hasReadHint", "yes");
    }

    useEffect(()=> {
        const readHintStatus = localStorage.getItem("hasReadHint");
       if(readHintStatus === "yes"){
        setHasReadHint(false)
       }
    }, [])

    return(
        <>
            {
                hasReadHint ? 
                <div className="review-collaboration-card-hint">
                    <div className="collaboration-card-header">
                        <span>Want to <br /> contribute with data?</span>
                        <CloseIcon onClick={setCollabCookieValue} className="collaboration-card-close-icon"/>
                    </div>
                    <div className="collaboration-card-body">
                        <p>Find out how to be <br /> a part of the <br /> <span>independent stocktaking effort</span> <br /> by collaborating <br /> with us.</p>
                    </div>
                    <div className="collaboration-card-footer">
                        <ArrowDownward className="collaboration-card-arrow-icon"/>
                    </div>
                </div> : ""
            }
        </>
    )
}

export default CollaborationCardHint