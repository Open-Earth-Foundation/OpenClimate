import { SearchForm } from "./SearchForm";

export default {
    title: 'Components /Level Cards Search/ Form',
    component: SearchForm,
    parameters: {
        componentSubtitle: "Display a component for the explore Form",
    }

}

const Template = (args:any) => <SearchForm {...args}/>

export const Default = Template.bind({});