import { Button } from "./Button";

export default {
    title: 'Components / Level Cards Search / Button',
    component: Button,
    parameters: {
        componentSubtitle: "Display a Button"
    }
}

const Template = (args:any) => <Button {...args}/>

export const Default = Template.bind({});
