import styled from 'styled-components';

import { HoneyFlexBox } from '../HoneyFlexBox';

export const HoneyListStyled = styled(HoneyFlexBox).attrs(({ $overflow = 'hidden auto' }) => ({
  $overflow,
}))``;
