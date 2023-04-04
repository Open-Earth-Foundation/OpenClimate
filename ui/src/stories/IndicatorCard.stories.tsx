import {IndicatorCard} from "./IndicatorCard";

export default {
    title: 'IndicatorCard',
    component: IndicatorCard,
    parameters: {
        componentSubtitle: "Display a component data indicators"
    }
}

const Template = (args:any) => <IndicatorCard {...args}/>

export const Mobile = Template.bind({});