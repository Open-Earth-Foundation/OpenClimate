import React from 'react'

import styled from 'styled-components'

const SectionDiv = styled.div`
  margin-bottom: 30px;
  padding: 20px 25px;
  width: 100%;
  color: ${(props) => props.theme.text_color};
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.background_primary};
`

function PageSection(props) {
  return <SectionDiv>{props.children}</SectionDiv>
}

export default PageSection
