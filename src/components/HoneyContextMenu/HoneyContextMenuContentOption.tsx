import React from 'react';
import type { HTMLAttributes } from 'react';

import { HoneyBox } from '../HoneyBox';
import { useHoneyPopupContext } from '../HoneyPopup';
import type { HoneyBoxProps } from '../HoneyBox';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';

export interface HoneyContextMenuContentOptionProps<
  Option extends HoneyContextMenuOption<Context>,
  Context,
> extends HTMLAttributes<HTMLDivElement>,
    HoneyBoxProps {
  option: Option;
}

export const HoneyContextMenuContentOption = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
>({
  option,
  ...props
}: HoneyContextMenuContentOptionProps<Option, Context>) => {
  const { context } = useHoneyPopupContext();

  return (
    <HoneyBox onClick={() => option.onClick?.({ context })} {...props}>
      {option.label}
    </HoneyBox>
  );
};
