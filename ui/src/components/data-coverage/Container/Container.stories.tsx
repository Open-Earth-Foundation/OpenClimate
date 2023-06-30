import Container from "./Container";

export default {
    title: 'Components / Level Cards Search / Button',
    component: Container,
    parameters: {
        componentSubtitle: "Display a Button"
    }
}

const Template = (args:any) => <Container {...args}/>

export const Default = Template.bind({});
