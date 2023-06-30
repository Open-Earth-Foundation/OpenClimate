import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport";
import { configure } from '@storybook/react';

const images = require.context('../src/assets/images', true)

configure(()=>{
  images.keys().forEach(images)
}, module)

// Custom viewports
const MY_VIEWPORTS = {
  FHD: {
    name: "FHD - 1080p",
    styles: {
      width: "1900",
      height: "1080"
    }
  }
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS
  }
}