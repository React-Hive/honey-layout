import styled from 'styled-components';

import { HoneyBox } from './HoneyBox';

export const HoneyFlexBox = styled(HoneyBox).attrs(({ $display, $flexDirection }) => ({
  $display: $display ?? 'flex',
  $flexDirection: $flexDirection ?? 'column',
}))``;
