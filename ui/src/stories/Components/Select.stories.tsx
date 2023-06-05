import { Select } from "./Select";

export default {
    title: 'Components / Level Cards Search/ Select Dropdown',
    component: Select,
    parameters: {
        componentSubtitle: "Select Component with Dropdown",
    }

}

const Template = (args:any) => <Select {...args}/>

export const Default = Template.bind({});

Default.args = {
    label: "Source",
    placeholder: "Selected",
    selected: "2023",
    items: ["2023", "2022", "2021", "2020", "2019"]
};