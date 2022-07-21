import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import ISite from '../../../../api/models/DTO/Site/ISite';
import './nested-accounts.widget.scss';

interface Props {
    sites?: Array<ISite>,
    detailsLink?: string
    detailsClick?: () => void
}

const NestedAccountsWidget: FunctionComponent<Props> = (props) => {

    const { sites, detailsLink, detailsClick } = props;

    return (
        
        <div className="widget">
        <div className="widget__wrapper" >
            <div className="widget__header">
                <div className="widget__title-wrapper">
                    <h3 className="widget__title">
                        Nested credentials
                    </h3> 
                    {detailsLink ?
                    <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                    :
                    <a href="#" className="widget__link" onClick={detailsClick}>See details</a>         
                    }
                </div>

                <span className="widget__updated">Last Updated June 2020</span>     

            </div>


            <div className="widget__content">
                    {sites?.length ? 
                    <>
                        <div className="widget__nested-accounts-content">
                            <table className="widget__nested-accounts">
                                <thead>
                                    <tr>
                                        <th>
                                            Certificate ID
                                        </th>
                                        <th>
                                            Type
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        sites?.map(s => 
                                            <tr key={s.id}>
                                                <td>
                                                    <a href="#" className="widget__credentials-link">06542-308834</a>
                                                </td>
                                                <td>{s.facility_name} {s.facility_type}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
                    
                    <div className="widget__no-data">
                        <div className="widget__no-data-title">
                            No data yet
                        </div>
                    </div>

                    }
                </div>
        </div>
    </div>



    );
}


export default NestedAccountsWidget;
