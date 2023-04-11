import React from 'react';
import { CloseIcon } from './CloseIcon';


export default {
    title: 'Components / Level Cards Search / Close Icon',
    component: CloseIcon,
    parameters: {
        componentSubtitle: "Display a component for the close icon"
    }
}

const Template = (args:any) => <CloseIcon {...args}/>

export const Default = Template.bind({});
