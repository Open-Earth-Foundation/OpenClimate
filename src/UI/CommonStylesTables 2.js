import styled from 'styled-components'
import { ReactComponent as Remove } from '../assets/remove.svg'
import { ReactComponent as Edit } from '../assets/edit.svg'
import { ReactComponent as Email } from '../assets/email.svg'
import { ReactComponent as Help } from '../assets/help.svg'

export const DataTable = styled.table`
  box-sizing: content-box;
  margin-top: -16px;
  margin-left: -25px;
  width: calc(100% + 50px);
  border-collapse: collapse;
`

export const DataRow = styled.tr`
  :nth-child(2n + 2) td {
    background: ${(props) => props.theme.background_secondary};
  }

  :hover td {
    cursor: pointer;
    background: #ffc;
  }
`

export const DataHeader = styled.th`
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid ${(props) => props.theme.primary_color};
`

export const DataCell = styled.td`
  padding: 8px 12px;
  text-align: left;
`

export const AttributeTable = styled.table`
  margin-bottom: 1em;
  border-collapse: collapse;
`

export const AttributeRow = styled.tr`
  th {
    padding: 0 6px;
    text-align: right;
  }
`

export const IconCell = styled.td`
  color: ${(props) => props.theme.primary_color};
  box-shadow: none;
  text-align: center;
  font-size: 1.2em;
  :hover {
    cursor: pointer;
  }
`

export const IconEdit = styled(Edit)`
  fill: ${(props) => props.theme.primary_color};
`

export const IconRemove = styled(Remove)`
  fill: ${(props) => props.theme.negative_color};
`

export const IconEmail = styled(Email)`
  fill: ${(props) =>
    !props.disabled ? props.theme.secondary_color : props.theme.neutral_color};
`

export const IconHelp = styled(Help)`
  fill: ${(props) => props.theme.primary_color};
`
