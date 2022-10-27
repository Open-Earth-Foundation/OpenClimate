
import { FunctionComponent, useEffect, useState } from 'react'
import LevelCard from '../explore/level-cards/level-card'
import { ArrowForwardIos } from '@mui/icons-material'
import EarthCard from './earthcard'

interface IProps {
    actors: Array<any>
}

const LevelCards: FunctionComponent<IProps> = (props) => {

    const {actors} = props

    const [isCity, setIsCity] = useState<boolean>(true);

    return (
        <div className="review__earth-main">

            <EarthCard />

            {
                actors.length > 1 &&
                    <div className="review__arrow-forward">
                        <ArrowForwardIos/>
                    </div>

            }
            <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" }>
                <LevelCard
                    label="Country"
                    disabled={false}
                    selectedValue={actors.length > 1 && actors[1].name}
                    placeholder={"Search for a country"}
                    options={["Canada", "Brazil", "Canada", "Brazil", "Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil"]}
                />
            </div>
            {
                actors.length > 1 &&
                    <div className="review__arrow-forward">
                        <ArrowForwardIos/>
                    </div>

            }
            <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" }>
                <LevelCard
                    label="Region/Province"
                    disabled={false}
                    selectedValue={actors.length > 2 && actors[2].name}
                    placeholder={"Regions, states, provinces.."}
                    options={["Canada", "Brazil", "Canada", "Brazil", "Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil"]}
                />
            </div>
            {
                actors.length > 1 &&
                    <div className="review__arrow-forward">
                        <ArrowForwardIos/>
                    </div>

            }
            <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" }>
                <LevelCard
                    label={ isCity ? "City" : "Company" }
                    disabled={false}
                    selectedValue={actors.length > 3 && actors[3].name}
                    placeholder={ isCity ? "Cities.." : "Companies.."}
                    options={["Canada", "Brazil", "Canada", "Brazil", "Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil","Canada", "Brazil"]}
                    onButtonSwap={() => setIsCity(!isCity)}
                    isCity={isCity}
                />
            </div>

        </div>
    )
}

export default LevelCards