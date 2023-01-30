
import React, { FunctionComponent, useEffect, useState } from 'react'
import LevelCard from '../explore/level-cards/level-card'
import { ArrowForwardIos } from '@mui/icons-material'
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option'
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes'
import IndicatorCard from './indicator-card'
import { useMatomo } from '@datapunt/matomo-tracker-react'


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

    const { trackEvent } = useMatomo();

    const onActorSelect = (option: DropdownOption, cardType: FilterTypes, cardLabel: string) => {
        trackEvent({
            category: 'Explore',
            action: `explore-select-${cardLabel.toLowerCase()}`,
            name: `${option.value}`,
        })
        selectFilterHandler(cardType, option);
    }

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        const actor_id = option.value;
        let tempCards = cards.slice();
        switch (filterType) {
            case FilterTypes.City:
            case FilterTypes.Company:
                tempCards[2] = {...tempCards[2], selectedValue: option.name }
                break;
            case FilterTypes.SubNational:
                const type = cards[2].type === FilterTypes.City ? 'city' : 'site';
                getOptions(actor_id, type)
                .then((options) => {
                    tempCards[1] = {...tempCards[1], selectedValue: option.name};
                    tempCards[2] = {...tempCards[2], selectedValue: '', options: options};
                });
                break;
            case FilterTypes.National:
                getOptions(actor_id, 'adm1')
                .then((options) => {
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

    const getOptions = async(actor_id: string, type: string) => {
        const recursive = (type == 'city' || type == 'site') ? 'yes' : 'no'
        const res = await fetch(`/api/v1/actor/${actor_id}/parts?type=${type}&recursive=${recursive}`)
        const json = await res.json()

        return json.data.map((part:any) => {
            return {
                name: part.name,
                value: part.actor_id,
                data: part.has_data
            }
        })
    }

    useEffect(() => {

        const setupLevels = async () => {

            const options = Array(3).fill([])
            const selected = Array(3).fill('')

            options[0] = await getOptions('EARTH', 'country')

            const country = actors.find(actor => actor.type == 'country')

            if (country) {
                selected[0] = country.actor_id
                options[1] = await getOptions(country.actor_id, 'adm1')
            }

            const region = actors.find(actor => actor.type == 'adm1')

            const city = actors.find(actor => actor.type == 'city')
            const site = actors.find(actor => actor.type == 'site')

            // evanp: these need to be in this order; a site can be in a city!

            if (site && isCity) {
                setIsCity(true)
            } else if (city && !isCity) {
                setIsCity(false)
            }

            if (region) {
                selected[1] = region.actor_id
                options[2] = await getOptions(region.actor_id, isCity ? 'city' : 'site')
            }

            // evanp: these need to be in this order; a site can be in a city!

            if (site) {
                selected[2] = site.actor_id
            } else if (city) {
                selected[2] = city.actor_id
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
        const setupCityOrSite = async() => {
            let toggleCard = cards.slice().pop();
            let parentId = cards[1].selectedValue

            if (!isCity && toggleCard?.type === FilterTypes.City) {
                toggleCard = {
                    label: "Company",
                    type: FilterTypes.Company,
                    selectedValue: '',
                    placeholder: "Companies...",
                    options: await getOptions(parentId, 'site')
                }
            } else if (isCity && toggleCard?.type === FilterTypes.Company) {
                toggleCard = {
                    label: "City",
                    type: FilterTypes.City,
                    selectedValue: '',
                    placeholder: "Cities...",
                    options: await getOptions(parentId, 'city')
                }
            }
            toggleCard && setCards(cards.slice(0,2).concat(toggleCard));
        }

        setupCityOrSite().catch((err) => console.error(err))

    }, [isCity])

    // evanp: I broke the component because we can have hidden values when we use the 'recursive' flag.
    // So instead of card index == actor index, we have to check by type for all these values

    const getActorByType = (actors, type) => {
        switch (type) {
            case FilterTypes.City:
                return actors.find(actor => actor.type == 'city')
                break
            case FilterTypes.Company:
                return actors.find(actor => actor.type == 'site')
                break
            case FilterTypes.SubNational:
                return actors.find(actor => actor.type == 'adm1')
                break
            case FilterTypes.National:
                return actors.find(actor => actor.type == 'country')
                break
        }
    }

    const getParentByType = (actors, type) => {
        switch (type) {
            case FilterTypes.City:
            case FilterTypes.Company:
                return actors.find(actor => actor.type == 'adm1')
                break
            case FilterTypes.SubNational:
                return actors.find(actor => actor.type == 'country')
                break
            case FilterTypes.National:
                return actors.find(actor => actor.type == 'planet')
                break
        }
    }

    const getActiveByType = (actors, type) => {
        if (actors.length === 0) {
            return false
        } else {
            const last = actors[actors.length - 1]
            switch (type) {
                case FilterTypes.Company:
                    return last.type == 'site'
                    break
                case FilterTypes.City:
                    return last.type == 'city'
                    break
                case FilterTypes.SubNational:
                    return last.type == 'adm1' || last.type == 'adm2'
                    break
                case FilterTypes.National:
                    return last.type == 'country'
                    break
            }
        }
    }

    return (
        <div className="review__earth-main">

            <IndicatorCard label={"Globe"} current={actors[0]} parent={null} isActive={actors.length === 1}/>

            { cards.map((card, index) =>
                <React.Fragment key={`card-fragment-${card.label}`}>
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
                            current={getActorByType(actors, card.type)}
                            parent={getParentByType(actors, card.type)}
                            isActive={getActiveByType(actors, card.type)}
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
                                onSelect={(option: DropdownOption) => onActorSelect(option, card.type, card.label)}
                                onDeSelect={() => deselectFilterHandler(card.type) }
                                options={card.options}
                                isCity={index === 2 ? isCity : undefined}
                                onButtonSwap={index === 2 ? () => setIsCity(!isCity) : undefined}
                            />
                        </div>
                    }
                </React.Fragment>
            )}

        </div>
    )
}

export default LevelCards;