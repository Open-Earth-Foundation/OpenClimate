import { FunctionComponent } from "react";
import { FilterTypes } from "../../../api/models/review/dashboard/filterTypes";
import { CircleFlag } from 'react-circle-flags';
import '../review.page.scss';



interface Props {
    icon: string;
    currentActorId: string;
    parentActorId: string;
    currentActorType: FilterTypes;
}

const ActorFlag: FunctionComponent<Props> = (props) => {
    const { icon, currentActorId, parentActorId, currentActorType } = props;


    return currentActorType < FilterTypes.City ? 
    (
        icon ?
            <img src={icon} className="review__icon"/>
            :
            <CircleFlag countryCode={currentActorType === FilterTypes.SubNational ? parentActorId.toLowerCase() : currentActorId.toLowerCase()} height="35" />
    )
    :
    (
        //default icon image
        <></>
    )

}

export default ActorFlag;