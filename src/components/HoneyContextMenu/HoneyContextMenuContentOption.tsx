import React from 'react';
import type { ReferenceType } from '@floating-ui/react';

import { HoneyBox } from '../HoneyBox';
import { useHoneyPopupContext } from '../HoneyPopup';
import type { HoneyBoxProps } from '../HoneyBox';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';

export interface HoneyContextMenuContentOptionProps<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
> extends HoneyBoxProps {
  option: Option;
}

export const HoneyContextMenuContentOption = <
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
>({
  option,
  ...props
}: HoneyContextMenuContentOptionProps<Option, Context, Reference>) => {
  const { context, floatingContext } = useHoneyPopupContext<Context, Reference>();

  const handleClick = () => {
    option.onClick?.({ context, floatingContext });
  };

  return (
    <HoneyBox onClick={handleClick} {...props}>
      {option.label}
    </HoneyBox>
  );
};
