import React from 'react';

import { HoneyBox } from '../HoneyBox';
import { useHoneyPopupContext } from '../HoneyPopup';
import type { HoneyBoxProps } from '../HoneyBox';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';

export interface HoneyContextMenuContentOptionProps<
  Option extends HoneyContextMenuOption<Context>,
  Context,
> extends HoneyBoxProps {
  option: Option;
}

export const HoneyContextMenuContentOption = <
  Option extends HoneyContextMenuOption<Context>,
  Context,
>({
  option,
  ...props
}: HoneyContextMenuContentOptionProps<Option, Context>) => {
  const { context } = useHoneyPopupContext();

  const handleClick = () => {
    option.onClick?.({ context });
  };

  return (
    <HoneyBox onClick={handleClick} {...props}>
      {option.label}
    </HoneyBox>
  );
};
