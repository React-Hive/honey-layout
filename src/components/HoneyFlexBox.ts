import styled from 'styled-components';

import { HoneyBox } from './HoneyBox';

export const HoneyFlexBox = styled(HoneyBox)``;

HoneyFlexBox.defaultProps = {
  $display: 'flex',
  $flexDirection: 'column',
};
