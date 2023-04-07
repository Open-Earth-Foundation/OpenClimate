import { ResultsItem } from "./ResultsItem";

export default {
    title: 'Components /Level Cards Search/ ResultsItem',
    component: ResultsItem,
    parameters: {
        componentSubtitle: "Display a component for the explore a results Item",
    }

}

const Template = (args:any) => <ResultsItem {...args}/>

export const Default = Template.bind({});