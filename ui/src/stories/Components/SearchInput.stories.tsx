import { SearchInput } from "./SearchInput";

export default {
    title: 'Components / Level Cards Search/ Search Input',
    component: SearchInput,
    parameters: {
        componentSubtitle: "Display a component for the dropdown",
    }

}

const Template = (args:any) => <SearchInput {...args}/>

export const Default = Template.bind({});