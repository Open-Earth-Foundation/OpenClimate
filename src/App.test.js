import React from 'react'
import { render } from '@testing-library/react'
import App from './App'
import { Provider } from 'react-redux';
import store from './store/index'

test('Renders app frame', () => {
  const { getById } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  const frameElement = document.getElementById('app-frame')
  expect(frameElement).toBeInTheDocument()
})

test('Renders <main> element', () => {
  const { getByElement } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  const mainElement = document.getElementsByTagName('main')
  expect(mainElement.length).toBe(1)
})
