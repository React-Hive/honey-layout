import styled from 'styled-components';

import type { HoneyBoxProps } from './HoneyBox';
import { HoneyBox } from './HoneyBox';

export type HoneyFlexBoxProps = HoneyBoxProps;

export const HoneyFlexBox = styled(HoneyBox).attrs(
  ({ $display = 'flex', $flexDirection = 'column' }) => ({
    $display,
    $flexDirection,
  }),
)<HoneyFlexBoxProps>``;
