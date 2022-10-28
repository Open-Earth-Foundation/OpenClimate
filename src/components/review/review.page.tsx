import { FunctionComponent, useEffect, useState } from 'react'
import ReviewFilters from './review-filters/review-filters';
import Dashboard from './review-dashboard/review-dashboard';
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option';
import {Oval} from "react-loader-spinner";
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes';
import { CircleFlag } from 'react-circle-flags';
import './review.page.scss';
import '../explore/explore.page.scss'
import {HiOutlineSearch} from 'react-icons/hi'
import Bg from './img/Earth_Background_Home_Gray.png';
import LevelCards from './levelcards'

interface IProps {
    actorID: string;
}

 const ReviewPage: FunctionComponent<IProps> = (props) => {

    const { actorID  } = props;

    const [actors, setActors] = useState<any>([])

    const current = (actors.length > 0) ? actors[actors.length - 1] : null
    const parent = (actors.length > 1) ? actors[actors.length - 2] : null

    // XXX: figure this out

    const loading = false

    // Load the provided actor

    useEffect(() => {
        insertActor(actorID, [])
    }, [])

    const getActorsLevelCardData = () => {
        let simplifiedActors: { actor_id: any; latestEmissions: any; latestPopulation: any; latestTargets: any; }[] = []
        
        // using end of the list of sources due to new PRIMAP source having most recent data, could change
        
        actors.map((actor: any) => {
            const emissionSources = actor?.emissions?.length && Object.keys(actor.emissions);
            const latestSourceIndex = emissionSources?.length - 1;
            console.log(emissionSources);
            const simplifiedActorObject = {
                actor_id: actor?.actor_id,
                latestEmissions: actor?.emissions?.[emissionSources?.[latestSourceIndex]]?.data ?? {},
                latestPopulation: actor?.population?.[0],
                latestTargets: actor?.targets?.[0]
            };
            console.log(actor, simplifiedActorObject);
            simplifiedActors.push(simplifiedActorObject)
        })
        return simplifiedActors;
    }

    const insertActor = (actorID: any, children: Array<any>) => {
        fetch(`/api/v1/actor/${actorID}`)
        .then((res) => res.json())
        .then((json) => json.data)
        .then((actor) => {
            if (!actor?.is_part_of) {
                setActors([actor].concat(children))
            } else {
                const pi = actors?.findIndex((a: any) => a.actor_id == actor.is_part_of)
                if (pi !== -1) {
                    // Parent is already part of the array, so just slice and concat
                    setActors(actors?.slice(0, pi + 1).concat([actor]).concat(children))
                } else {
                    // Parent is not part of the array, so go up one level and try again
                    insertActor(actor?.is_part_of, [actor].concat(children))
                }
            }
        })
    }

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        insertActor(option.value, [])
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
                                        <p>Be part of the future of <span>Climate Data</span> </p>
                                    </div>
                                    <div className="review-info__content">
                                        Visualize, report and add relevant data to an <span>aggregated, verified and interoperable</span> portal for climate actions and tracking.
                                    </div>
                                </div>
                            </>
                        }

                        <LevelCards
                            actors={actors}
                            selectFilter={selectFilterHandler}
                            deselectFilter={deselectFilterHandler}
                            parent={parent}
                        />

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
                                        <div>
                                            {current.flagCode ?
                                                <CircleFlag countryCode={current.icon} height="35" />
                                                : ""
                                            }
                                            <span className="review__entity-title">{current.name}</span>
                                        </div>
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

                    {
                        notJustEarth() ? "" :
                        <div className="contact__block">
                            <div className="contact__title">Looking where to add your data?</div>
                            <div className="contact__subtitle">Contact us and start now!</div>
                            <a href='mailto:climatedata@openearth.org'><button className="contact__button" >Contact us</button></a>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

ReviewPage.defaultProps = {
    actorID: "EARTH"
}

export default ReviewPage