import React from 'react';

import { ContextualDataWidget } from './ContextualData.widget';

export default {
    title: 'ContextualDataWidget',
    component: ContextualDataWidget,
}

const Template = (args:any) => <ContextualDataWidget {...args}/>

export const Mobile = Template.bind({});
