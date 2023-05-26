import Footer from "./Footer";

export default {
    title: 'Components /Sections/ Footer',
    component: Footer,
    parameters: {
        componentSubtitle: "Display a Footer section",
    }

}

const Template = (args:any) => <Footer {...args}/>

export const Default = Template.bind({});