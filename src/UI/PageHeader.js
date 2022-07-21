import React from 'react'

import styled from 'styled-components'

const Header = styled.header`
  margin-bottom: 30px;
  padding: 20px 25px;
  width: 100%;
  font-size: 1.5em;
  text-transform: uppercase;
  color: ${(props) => props.theme.text_color};
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.background_primary};
`

function PageHeader(props) {
  return (
    <Header>
      {props.title}
      {props.children}
    </Header>
  )
}

export default PageHeader
