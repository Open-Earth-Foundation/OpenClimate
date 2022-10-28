
import { FunctionComponent, useEffect, useState } from 'react'
import LevelCard from '../explore/level-cards/level-card'
import { ArrowForwardIos } from '@mui/icons-material'
import EarthCard from './earthcard'
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option'
import { NullLiteral, setSyntheticTrailingComments } from 'typescript'
import { NewFilterTypes } from '../../api/models/review/dashboard/filterTypes'


interface IProps {
    actors: Array<any>,
    selectFilter: (filterType: NewFilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: NewFilterTypes) => void
}

interface ICardProps {
    label: string;
    type: NewFilterTypes;
    placeholder: string;
    selectedValue: string;
    options: Array<DropdownOption>
}

const cardsTemplate: Array<ICardProps> = [
    {
        label: "Country",
        type: NewFilterTypes.National,
        selectedValue: '',
        placeholder: "Search for a country...",
        options: []
    },
    {
        label: "Region/Province",
        type: NewFilterTypes.SubNational,
        selectedValue: '',
        placeholder: "Regions, states, provinces...",
        options: []
    },
    {
        label: "City",
        type: NewFilterTypes.City,
        selectedValue: '',
        placeholder: "Cities...",
        options: []
    }
]

const LevelCards: FunctionComponent<IProps> = (props) => {

    const {actors, selectFilter, deselectFilter} = props;

    const [isCity, setIsCity] = useState<boolean>(true);

    const [cards, setCards] = useState<Array<ICardProps>>(cardsTemplate);
    console.log("cards", cards);

    useEffect(() => {
        fetch(`/api/v1/actor/EARTH/parts?type=country`)
        .then((res) => res.json())
        .then((json) => {
            let parts = json.data
            let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}})
            let tempCard = cards.slice()
            tempCard[0] = {...tempCard[0], options: options}
            tempCard[1] = {...tempCard[1], selectedValue: '', options: []}
            tempCard[2] = {...tempCard[2], selectedValue: '', options: []}
            setCards(tempCard);
        })
    }, [])

    useEffect(() => {
        let toggleCard = cards.slice().pop();
        if (!isCity && toggleCard?.type === NewFilterTypes.City) {
            toggleCard = {
                label: "Company",
                type: NewFilterTypes.Company,
                selectedValue: '',
                placeholder: "Companies...",
                options: []
            }
        } else if (isCity && toggleCard?.type === NewFilterTypes.Company) {
            toggleCard = {
                label: "City",
                type: NewFilterTypes.City,
                selectedValue: '',
                placeholder: "Cities...",
                options: []
            }
        }
        toggleCard && setCards(cards.slice(0,2).concat(toggleCard));
        
    }, [isCity])


    const arrowComponent = () =>
        {
            actors.length > 1 &&
                <div className="review__arrow-forward">
                    <ArrowForwardIos/>
                </div>

        }

    return (
        <div className="review__earth-main">

            <EarthCard />

            { cards.map((card, index) =>
                    <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" } key={index}>
                        <LevelCard
                            label={card.label}
                            disabled={card.options?.length === 0}
                            selectedValue={card.selectedValue}
                            placeholder={card.placeholder}
                            options={card.options}
                            isCity={index === 2 ? isCity : undefined}
                            onButtonSwap={index === 2 ? () => setIsCity(!isCity) : undefined}
                        />
                    </div>
            )}
            
            {/* <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" }>
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
            </div> */}

        </div>
    )
}

export default LevelCards