import styled from 'styled-components'

const Label = ({ label, children, ...props }) => (
  <Wrapper {...props}>
    <Text>{label}</Text>
    {children}
  </Wrapper>
)

export default Label

const Wrapper = styled.label`
  margin-top: 7px;
`
const Text = styled.span`
  margin-bottom: 4px;
  display: block;
  font-size: 14px;
  color: ${p => p.theme.colors.darkText};
`
