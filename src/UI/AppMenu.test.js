import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('Renders app menu', () => {
  const { getById } = render(<App />)
  const navElement = document.getElementById('app-menu')
  expect(navElement).toBeInTheDocument()
})
