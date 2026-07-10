import { styled } from '@react-hive/honey-style';

import { HoneyFlex } from '../HoneyFlex';
import type { HoneyFlexProps } from '../HoneyFlex';

export type HoneyContextMenuContentOptionStyledProps = HoneyFlexProps;

export const HoneyContextMenuContentOptionStyled = styled(HoneyFlex, {
  row: true,
})<HoneyContextMenuContentOptionStyledProps>``;
