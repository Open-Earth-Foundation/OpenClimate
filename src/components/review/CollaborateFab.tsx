import React, {useState} from "react";
import Fab from '@mui/material/Fab';
import Diversity3Icon from '@mui/icons-material/Diversity3';

const CollaborateFAB = () =>{

    const [extended, setExtended] = useState<string>("");

    const handleRevealText = (e:any) => {
        e.preventDefault();
        if(e.type){
            setExtended("extended");
            console.log(e)
        }
        else if(!e.type){
            setExtended("")
        }
    }

    const handleRevealTextOnLeave = (e:any) => {
        e.preventDefault();
        if(e.type){
            setExtended("");
            console.log(e)
        }
        else if(!e.type){
            setExtended("")
        }
    }
    return(
        <div className='review-colab-button' onMouseEnter={handleRevealText} onMouseLeave={handleRevealTextOnLeave}>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfL2_FpZZr_SfT0eFs_v4T5BsZnrNBbQ4pkbZ51JhJBCcud6A/viewform?pli=1&pli=1" target="_blank">
                <Fab variant={extended} className='review-colab-fab' aria-label="add">
                    <Diversity3Icon />
                {
                    extended ?  <span className='review-colab-fab-text'>Collaborate</span> : ''
                }
                </Fab>
            </a>
        </div>
    )
}

export default CollaborateFAB