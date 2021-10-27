import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('Renders app header', () => {
  const { getById } = render(<App />)
  const headerElement = document.getElementById('app-header')
  expect(headerElement).toBeInTheDocument()
})
