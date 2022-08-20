import styled from 'styled-components';
import * as colors from '../../config/colors';

export const CancelarButton = styled.nav`
  cursor: pointer;
  background: ${colors.dangerColor};
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 700;
  transition: all 300ms;

  button:hover {
    filter: brightness(75%);
  }
`;
export const Combo = styled.select`
  height: 40px;
  font-size: 18px;
  border: 1px solid #ddd;
  padding: 0 10px;
  border-radius: 4px;
  margin: 5px 0;
  &:focus {
    border: 1px solid ${colors.primaryColor};
  }
`;
export const Label = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* margin-bottom: 20px; */
  small {
    color: red;
    display: block;
  }
  select {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 10px;
    &:focus {
      border: 4px solid ${colors.inputBorder};
    }
  }
`;
