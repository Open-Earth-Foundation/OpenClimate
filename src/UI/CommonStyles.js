import styled from 'styled-components'

// Text alignments
export const TextAlignCenter = styled.div`
  text-align: center;
`

export const TextAlignRight = styled.div`
  text-align: right;
`

export const TextAlignLeft = styled.div`
  text-align: left;
`
export const HeaderText = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 21px;
`

export const Clickable = styled.a`
  cursor: pointer;
  color: ${(props) => props.theme.primary_color};
`

export const CopyText = styled.div`
  font-size: 16px;
  font-weight: 500;
`
export const InfoText = styled.div`
  font-size: 18px;
  line-height: 21px;
  font-family: Lato;
`

export const SuccessText = styled.div`
  font-size: 16px;
  font-family: Lato;
`

export const ItalicText = styled.div`
  font-style: italic;
`

export const PrimaryColor = styled.div`
  color: ${(props) => props.theme.primary_color}
`

export const InlineClickable = styled.a`
  padding: 0 4px;
  text-decoration: underline;
  cursor: pointer;
  font-family: Lato;
  color: ${(props) => props.theme.primary_color};
`
