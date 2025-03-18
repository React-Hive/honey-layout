import styled from 'styled-components';

import { HoneyBox } from './HoneyBox';

export const HoneyFlexBox = styled(HoneyBox).attrs(
  ({ $display = 'flex', $flexDirection = 'column' }) => ({
    $display,
    $flexDirection,
  }),
)``;
