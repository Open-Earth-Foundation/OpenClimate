
import { FunctionComponent, useEffect, useState } from 'react'
import LevelCard from '../explore/level-cards/level-card'
import { ArrowForwardIos } from '@mui/icons-material'
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option'
import { NullLiteral, setSyntheticTrailingComments } from 'typescript'
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes'
import IndicatorCard from './indicator-card'


interface IProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    actors: Array<any>
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


    const [cards, setCards] = useState<Array<ICardProps>>(cardsTemplate);

    const [storedOptions, setStoredOptions] = useState<Array<DropdownOption>>([]);

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        const actor_id = option.value;
        let tempCards = cards.slice();
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
                })
                break;
            }
        selectFilter(filterType, option);
        setCards(tempCards);
    };

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

        const getOptions = async(actor_id: string, type: string) => {
            const res = await fetch(`/api/v1/actor/${actor_id}/parts?type=${type}`)
            const json = await res.json()
            return json.data.map((part:any) => {
                return {
                    name: part.name, value: part.actor_id
                }
            })
        }

        const setupLevels = async() => {

            const options = Array(3).fill([])
            const selected = Array(3).fill('')

            options[0] = await getOptions('EARTH', 'country')

            if (actors.length > 1) {
                selected[0] = actors[1].actor_id
                options[1] = await getOptions(actors[1].actor_id, 'adm1')
            }

            if (actors.length > 2) {
                selected[1] = actors[2].actor_id
                options[2] = await getOptions(actors[2].actor_id, 'city')
            }

            if (actors.length > 3) {
                selected[2] = actors[3].actor_id
            }

            let tempCard = cards.slice()
            tempCard[0] = {...tempCard[0], options: options[0], selectedValue: selected[0]}
            tempCard[1] = {...tempCard[1], selectedValue: selected[1], options: options[1]}
            tempCard[2] = {...tempCard[2], selectedValue: selected[2], options: options[2]}
            setCards(tempCard);
        }

        setupLevels().catch((err) => console.error(err))

    }, [actors])

    useEffect(() => {
        let toggleCard = cards.slice().pop();

        if (!isCity && toggleCard?.type === FilterTypes.City) {
            toggleCard = {
                label: "Company",
                type: FilterTypes.Company,
                selectedValue: '',
                placeholder: "Companies...",
                options: storedOptions ? storedOptions : []
            }
        } else if (isCity && toggleCard?.type === FilterTypes.Company) {
            toggleCard = {
                label: "City",
                type: FilterTypes.City,
                selectedValue: '',
                placeholder: "Cities...",
                options: storedOptions ? storedOptions : []
            }
        }
        cards?.[2]?.options && setStoredOptions(cards[2].options);
        toggleCard && setCards(cards.slice(0,2).concat(toggleCard));

    }, [isCity])


    return (
        <div className="review__earth-main">

            <IndicatorCard label={"Globe"} current={actors[0]} parent={null} isActive={actors.length === 1}/>

            { cards.map((card, index) =>
                <>
                    {
                        actors.length > 1 &&
                            <div className="review__arrow-forward" key={`arrow-forward-${index}`}>
                                <ArrowForwardIos/>
                            </div>
                    }
                    {
                        card.selectedValue ?
                        <IndicatorCard
                            label={card.label}
                            current={actors?.[index + 1]}
                            parent={actors?.[index]}
                            isActive={actors.length === index + 2}
                            onDeSelect={() => deselectFilterHandler(card.type)}
                            key={`indicator-card-${card.selectedValue}`}
                        />
                        :
                        <div className={ actors.length > 1 ? "review__card-actor-selected" : "review__card" } key={`review-card-div-${index}`}>
                            <LevelCard
                                label={card.label}
                                key={`level-card-${card.label}`}
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
                    }
                </>
            )}

        </div>
    )
}

export default LevelCards;