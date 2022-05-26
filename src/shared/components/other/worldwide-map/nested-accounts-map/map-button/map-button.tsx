import { FunctionComponent } from 'react';
import ZoomoutIcon from '../../../../img/form-elements/map-button/magnify-minus-outline.png';
import DashboardIcon from '../../../../img/form-elements/map-button/view-dashboard.png';
import './map-button.scss';

interface Props {
    text: string,
    iconType: 'zoomout' | 'dashboard',
    onClick: () => void
}

const MapButton: FunctionComponent<Props> = (props) => {

    const { text, iconType, onClick } = props;

    const srcIcon = iconType === 'zoomout' ? ZoomoutIcon : DashboardIcon;
    
    return (
        <button className="map-button" onClick={onClick}>
            <img src={srcIcon} className="map-button_img" alt='zoomout' />
            {text}
        </button>
    )
}
    
export default MapButton
