import styled from 'styled-components';

import { HoneyBox } from './HoneyBox';

export const HoneyFlexBox = styled(HoneyBox)`
  display: flex;
`;

HoneyFlexBox.defaultProps = {
  $flexDirection: 'column',
};
