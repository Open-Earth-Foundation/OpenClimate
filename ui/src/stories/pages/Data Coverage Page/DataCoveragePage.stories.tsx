import DataCoveragePage from "./DataCoveragePage";

export default {
    title: 'Pages / Data Coverage Page',
    component: DataCoveragePage,
    parameters: {
        componentSubtitle: "Display a data coverage page"
    }
}

const Template = (args:any) => <DataCoveragePage {...args}/>

export const Default = Template.bind({});
