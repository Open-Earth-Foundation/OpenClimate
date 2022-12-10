import { FunctionComponent, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import Dashboard from './review-dashboard/review-dashboard';
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option';
import {Oval} from "react-loader-spinner";
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes';
import './review.page.scss';
import '../explore/explore.page.scss'
import {HiOutlineSearch} from 'react-icons/hi'
import Bg from './img/Earth_Background_Home_Gray.png';
import LevelCards from './level-cards'
import CollaborateFAB from './CollaborateFab';
import CollaborationCardHint from './CollaborateCardHint';
import ActorFlag from './actor-flag/actor-flag';

type ReviewPageParams = {
    actorID: string;
};

const ReviewPage: FunctionComponent = () => {

    const history = useHistory()
    const params = useParams<ReviewPageParams>()
    const actorID = ('actorID' in params) ? params['actorID'] : 'EARTH'

    const [actors, setActors] = useState<any>([])

    const current = (actors.length > 0) ? actors[actors.length - 1] : null
    const parent = (actors.length > 1) ? actors[actors.length - 2] : null

    const loading = false

    const handleParams = (actorID: string) => {
        if (actorID === 'EARTH') {
            actors.length > 1 && deselectFilterHandler(FilterTypes.National);
        } else {
            if (actors.length === 1 || (actors.length > 1 && actorID !== current.actor_id)) {
                insertActor(actorID, []);
            }
        }
    }

    // Load the provided actor

    useEffect(() => {
        insertActor(actorID, []);
    }, [])

    useEffect(() => {
        handleParams(actorID);
    }, [actorID])


    const insertActor = (actorID: any, children: Array<any>) => {
        fetch(`/api/v1/actor/${actorID}`)
        .then((res) => res.json())
        .then((json) => json.data)
        .then((actor) => {
            if (!actor?.is_part_of) {
                setActors([actor].concat(children));
            } else {
                const pi = actors?.findIndex((a: any) => a.actor_id == actor.is_part_of);
                if (pi !== -1) {
                    // Parent is already part of the array, so just slice and concat
                    setActors(actors?.slice(0, pi + 1).concat([actor]).concat(children));
                } else {
                    // Parent is not part of the array, so go up one level and try again
                    insertActor(actor?.is_part_of, [actor].concat(children));
                }
            }
        })
    }

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        const actor_id = option.value;
        insertActor(actor_id, []);
        history.push((actor_id === 'EARTH') ? '/' : `/actor/${option.value}`);
    }

    const deselectFilterHandler = (filterType: FilterTypes) => {
        let newActorsList = actors.slice();
        switch (filterType) {
            case FilterTypes.City:
            case FilterTypes.Company:
                newActorsList.splice(3, 1);
                break;
            case FilterTypes.SubNational:
                newActorsList.splice(2,2);
                break;
            case FilterTypes.National:
                newActorsList.splice(1,3);
                break;
        }
        history.push(`/actor/${newActorsList[newActorsList.length - 1].actor_id}`);
        setActors(newActorsList);
    }


    const notJustEarth = () => actors.length > 1

    return (
        <div className="review">
            <div className="review__wrapper" style={{backgroundImage: notJustEarth() ? `url(${Bg})`: ""}}>
                <div style={{backgroundColor : notJustEarth() ? "rgba(255,255,255, 0.8)": "", height: notJustEarth() ? "100%": "", paddingBottom: "50px"}} className="review__foreground">
                    {
                        notJustEarth() ? '':
                        <div className='review__background-content'>
                            <div className='review__background-content-left'></div>
                        </div>
                    }

                    {loading ?
                        <div className="loader">
                            <Oval
                            color="#A3A3A3"
                            height={100}
                            width={100}
                            />
                        </div>
                    : ""
                    }

                    <div className="review__top-wrapper content-wrapper">
                        {
                            notJustEarth() ? '':
                            <>
                                <p className='review__heading'>Earth Indicators</p>
                                <div className="review__info">
                                    <div className="review-info__title">
                                        <p>Be part of the future of <span>Climate Data Collaboration</span> </p>
                                    </div>
                                    <div className="review-info__content">
                                        Visualize, report, and participate with relevant data to a <span>nested, aggregated, and interoperable open source</span> portal for climate accounting.
                                    </div>
                                </div>
                            </>
                        }

                        <div className={`${notJustEarth() ? "review__levelcards-wrapper": ""}`}>
                            <LevelCards
                                actors={actors}
                                selectFilter={selectFilterHandler}
                                deselectFilter={deselectFilterHandler}
                            />
                        </div>

                        <div className="review__filter-button-wrapper">
                            <a href='/explore'>
                                <button className="review__filter-button">
                                    <HiOutlineSearch className='review__icon'/>
                                    <span>Explore by actor</span>
                                </button>
                            </a>
                        </div>

                        <div className="review_selected-entity">
                            {
                                (current && notJustEarth()) ?
                                    <div className="review__selected-entity">
                                        <>
                                            <ActorFlag
                                                currentActorId={current.actor_id}
                                                currentActorType={current.type}
                                                parentActorId={parent.actor_id}
                                                icon={current.icon}
                                            />
                                            <span className="review__entity-title">{current.name}</span>
                                        </>
                                    </div>
                                    :
                                    ""
                            }
                        </div>

                    </div>

                    <div className="review__content content-wrapper">
                        {
                            (current && notJustEarth()) ?
                            <>
                                <Dashboard key={`dashboard-${current.actor_id}`} current={current} parent={parent} />
                            </>
                            : ''
                        }
                    </div>

                    {/* CTA */}
                    <div className='review-cta' style={{justifyContent: notJustEarth() ? "flex-end": ""}}>
                        {
                            notJustEarth() ? "" :
                            <div className="contact__block">
                                <div className="contact__title">Looking where to add your data?</div>
                                <div className="contact__subtitle">Contact us and start now!</div>
                                <a href='mailto:climatedata@openearth.org'><button className="contact__button" >Contact us</button></a>
                            </div>
                        }
                        <div className="review-fab">
                            {/* New Collaborator Floating Card Hint */}
                            <CollaborationCardHint />
                            {/* Collaboration Floating Action button */}
                            <CollaborateFAB />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

ReviewPage.defaultProps = {
    actorID: "EARTH"
}

export default ReviewPage;