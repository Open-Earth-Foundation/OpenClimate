import { FunctionComponent } from "react";
import { FilterTypes } from "../../../api/models/review/dashboard/filterTypes";
import { CircleFlag } from 'react-circle-flags';
import '../review.page.scss';
import { PlaceOutlined, Apartment } from '@mui/icons-material';



interface Props {
    icon: string;
    currentActorId: string;
    parentActorId: string;
    currentActorType: string;
}

const ActorFlag: FunctionComponent<Props> = (props) => {
    const { icon, currentActorId, parentActorId, currentActorType } = props;


    return ["country", "adm1"].some(type => type === currentActorType) ? 
    (
        icon ?
            <img src={icon} className="review__icon"/>
            :
            <CircleFlag countryCode={currentActorType === "adm1" ? parentActorId.toLowerCase() : currentActorId.toLowerCase()} height="35" />
    )
    :
    (
        currentActorType === 'city' ?
            <div className="review__icon-container-city">
                <PlaceOutlined className="review__icon-city"/>
            </div>
            :
            <div className="review__icon-container-company">
                <Apartment className="review__icon-city"/>
            </div>
    )

}

export default ActorFlag;