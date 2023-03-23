import React from 'react';

import { ContextualDataWidget } from './ContextualData.widget';

export default {
    title: 'ContextualDataWidget',
    component: ContextualDataWidget,
    parameters: {
        componentSubtitle: "Display a component / widget that shows contextual data"
    }
}

const Template = (args:any) => <ContextualDataWidget {...args}/>

export const Mobile = Template.bind({});
