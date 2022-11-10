import React from 'react'

import styled from 'styled-components'

const Spinner = styled.div`
  width: 75px;
  height: 75px;
  margin: 0;
  background: transparent;
  border-top: 4px solid
    ${(props) => (props ? props.theme.primary_color : 'green')};
  //   border-top: 4px solid green;
  border-right: 4px solid transparent;
  border-radius: 50%;
  -webkit-animation: 1s spin linear infinite;
  animation: 1s spin linear infinite;
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes spin {
    from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`

const SpinnerOverlay = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  pointer-events: none;
  background: ${(props) => props.theme.background_secondary};
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingHolder = styled.div`
  width: 50%;
  font-size: 1.5em;
  color: ${(props) => props.theme.text_color};
  height: 200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function FullPageSpinner(props) {
  return (
    <SpinnerOverlay>
      <LoadingHolder>
        <p>Loading, please wait...</p>
        <Spinner />
      </LoadingHolder>
    </SpinnerOverlay>
  )
}

export default FullPageSpinner
