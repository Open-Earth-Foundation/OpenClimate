import React from 'react'
import { render } from '@testing-library/react'
import EmissionWidget from './emission.widget';
import { Provider } from 'react-redux';
import store from '../../../../store/index'

test('Renders empty Emission widget', () => {
  const { getByText } = render(
    <Provider store={store}>
      <EmissionWidget
        providerToEmissions={{}}
        isVisible />
    </Provider>
  )
  expect(getByText('No data sourced yet. Have any suggestions, contact ux@openearth.org!'))
})

test('Renders Emission widget w/ info', () => {

    const sampleProviderEmissions = {
        'PRIMAP': {
            actorType: "country",
            landSinks: 0,
            methodologyTags: [ "Combined datasets", "Country-reported data or third party", "Year gaps numerically extrapolated", 'Peer reviewed'],
            totalGhg: 733000,
            year: 2019
        }
    }
    const { getByText } = render(
      <Provider store={store}>
        <EmissionWidget
          providerToEmissions={sampleProviderEmissions}
          isVisible />
      </Provider>
    )
    expect(getByText('Total GHG Emissions'));
    expect(getByText('733'));
    expect(getByText('Source'));
    expect(getByText('Combined datasets'));
  })

