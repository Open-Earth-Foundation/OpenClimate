import TrendsWidget from "./TrendsWidget";

export default {
    title: 'Components / Widgets / Trends Widget',
    component: TrendsWidget,
    parameters: {
        componentSubtitle: "Trends Widget Component",
    }

}

const Template = (args:any) => <TrendsWidget {...args}/>

export const Default = Template.bind({});

Default.args = {};