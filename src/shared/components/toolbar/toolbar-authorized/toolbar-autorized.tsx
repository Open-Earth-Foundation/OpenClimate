import { FunctionComponent, useEffect } from 'react'
import AvaIcon from '../../../img/toolbar/ava.png';
import MenuDropdown from '../../form-elements/menu-dropdown/menu-dropdown';
import { IUser } from '../../../../api/models/User/IUser';
import './toolbar-autorized.scss';

interface Props {
    user: IUser | null,
    doLogout: () => void,
}

const ToolbarAutorized: FunctionComponent<Props> = (props) => {

    const { user, doLogout } = props;

    const companyName = user?.company?.name;
    useEffect(() => {
        console.log("User ",user)
      }, [])
    return (

        <div className="toolbar__autorized">
            <div className="toolbar__user-pic">
                <img src={AvaIcon} alt={companyName}/>
            </div>
            <div className="toolbar__user-menu">
                <MenuDropdown title={companyName} doLogout={doLogout} />
            </div>
        </div>
        
    );
}


export default ToolbarAutorized;
