import styled from 'styled-components';

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 32px;

  cursor: pointer;

  border: none;
  border-radius: 4px;
  background-color: unset;

  &:hover {
    background-color: #333333;
  }
`;
