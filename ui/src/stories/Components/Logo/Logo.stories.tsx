import Logo from "./Logo";

export default {
    title: 'Components / Navbar / Logo',
    component: Logo,
    parameters: {
        componentSubtitle: "Display a Logo"
    }
}

const Template = (args:any) => <Logo {...args}/>

export const Default = Template.bind({});
