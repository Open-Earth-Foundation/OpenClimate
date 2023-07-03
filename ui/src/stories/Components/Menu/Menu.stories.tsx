import Menu from "./Menu";

export default {
    title: 'Components / Navbar / Menu',
    component: Menu,
    parameters: {
        componentSubtitle: "Display a Button"
    }
}

const Template = (args:any) => <Menu {...args}/>

export const Default = Template.bind({});
