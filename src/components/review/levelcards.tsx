
import { FunctionComponent, useEffect, useState } from 'react'
import LevelCard from '../explore/level-cards/level-card'
import { ArrowForwardIos } from '@mui/icons-material'
import EarthCard from './earthcard'
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option'
import { NullLiteral, setSyntheticTrailingComments } from 'typescript'
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes'


interface IProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    actors: Array<any>,
}

interface ICardProps {
    label: string;
    type: FilterTypes;
    placeholder: string;
    selectedValue: string;
    options: Array<DropdownOption>
}

const cardsTemplate: Array<ICardProps> = [
    {
        label: "Country",
        type: FilterTypes.National,
        selectedValue: '',
        placeholder: "Search for a country...",
        options: []
    },
    {
        label: "Region/Province",
        type: FilterTypes.SubNational,
        selectedValue: '',
        placeholder: "Regions, states, provinces...",
        options: []
    },
    {
        label: "City",
        type: FilterTypes.City,
        selectedValue: '',
        placeholder: "Cities...",
        options: []
    }
]

const LevelCards: FunctionComponent<IProps> = (props) => {

    const {selectFilter, deselectFilter, actors} = props;

    const [isCity, setIsCity] = useState<boolean>(true);

    console.log(actors);

    const [cards, setCards] = useState<Array<ICardProps>>(cardsTemplate);

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        selectFilter(filterType, option);
        const actor_id = option.value
        let tempCards = cards.slice()
        switch (filterType) {
            case FilterTypes.City:
            case FilterTypes.Company:
                tempCards[2] = {...tempCards[2], selectedValue: option.name }
                break;
            case FilterTypes.SubNational:
                const type = cards[2].type === FilterTypes.City ? 'city' : 'organization';
                fetch(`/api/v1/actor/${actor_id}/parts?type=${type}`)
                .then((res) => res.json())
                .then((json) => {
                    let parts = json.data;
                    let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}});
                    tempCards[1] = {...tempCards[1], selectedValue: option.name};
                    tempCards[2] = {...tempCards[2], selectedValue: '', options: options};
                })
                break;
            case FilterTypes.National:
                fetch(`/api/v1/actor/${actor_id}/parts?type=adm1`)
                .then((res) => res.json())
                .then((json) => {
                    let parts = json.data;
                    let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}});

                    tempCards[0] = {...tempCards[0], selectedValue: option.name};
                    tempCards[1] = {...tempCards[1], selectedValue: '', options: options};
                    tempCards[2] = {...tempCards[2], selectedValue: '', options: []};
                    setCards(tempCards)
                })
                break;
            }
        setCards(tempCards);
    };

    console.log(actors);
    const deselectFilterHandler = (filterType: FilterTypes) => {
        let tempCards = cards.slice();
        switch (filterType) {
            case FilterTypes.City:
            case FilterTypes.Company:
                tempCards[2].selectedValue = '';
                break;
            case FilterTypes.SubNational:
                tempCards[1] = {...tempCards[1], selectedValue: ''};
                tempCards[2] = {...tempCards[2], selectedValue: '', options: []};
                break;
            case FilterTypes.National:
                tempCards[0] = {...tempCards[0], selectedValue: ''};
                tempCards[1] = {...tempCards[1], selectedValue: '', options: []};
                tempCards[2] = {...tempCards[2], selectedValue: '', options: []};
                break;
            default:
                break;

        }
        setCards(tempCards);
        deselectFilter(filterType);
    }

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
        if (!isCity && toggleCard?.type === FilterTypes.City) {
            toggleCard = {
                label: "Company",
                type: FilterTypes.Company,
                selectedValue: '',
                placeholder: "Companies...",
                options: []
            }
        } else if (isCity && toggleCard?.type === FilterTypes.Company) {
            toggleCard = {
                label: "City",
                type: FilterTypes.City,
                selectedValue: '',
                placeholder: "Cities...",
                options: []
            }
        }
        toggleCard && setCards(cards.slice(0,2).concat(toggleCard));
        
    }, [isCity])


    return (
        <div className="review__earth-main">

            <EarthCard />

            { cards.map((card, index) =>
                <>
                    {
                        actors.length > 1 &&
                            <div className="review__arrow-forward" key={`arrow-forward-${index}`}>
                                <ArrowForwardIos/>
                            </div>
                    }
                    <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" } key={`review-card-div-${index}`}>
                        <LevelCard
                            label={card.label}
                            key={`level-card-${index}`}
                            disabled={card.options?.length === 0}
                            buttonDisabled={cards[1].options.length === 0}
                            selectedValue={card.selectedValue}
                            placeholder={card.placeholder}
                            onSelect={(option: DropdownOption) => selectFilterHandler(card.type, option)}
                            onDeSelect={() => deselectFilterHandler(card.type) }
                            options={card.options}
                            isCity={index === 2 ? isCity : undefined}
                            onButtonSwap={index === 2 ? () => setIsCity(!isCity) : undefined}
                        />
                    </div>
                </>
            )}

        </div>
    )
}

export default LevelCards