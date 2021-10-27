import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('Renders app frame', () => {
  const { getById } = render(<App />)
  const frameElement = document.getElementById('app-frame')
  expect(frameElement).toBeInTheDocument()
})

test('Renders <main> element', () => {
  const { getByElement } = render(<App />)
  const mainElement = document.getElementsByTagName('main')
  expect(mainElement.length).toBe(1)
})
