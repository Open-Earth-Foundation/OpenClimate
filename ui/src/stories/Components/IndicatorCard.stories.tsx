import {IndicatorCard} from "./IndicatorCard";

export default {
    title: 'Components /Level Cards Search/ Indicator Card',
    component: IndicatorCard,
    parameters: {
        componentSubtitle: "Display a component data indicators",
    }

}

const Template = (args:any) => <IndicatorCard {...args}/>

export const Default = Template.bind({});