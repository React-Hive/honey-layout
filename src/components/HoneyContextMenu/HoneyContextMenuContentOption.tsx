import React from 'react';
import { isFunction } from '@react-hive/honey-utils';
import type { ReferenceType } from '@floating-ui/react';

import { useHoneyPopupContext } from '../HoneyPopup';
import { HoneyContextMenuContentOptionStyled } from './HoneyContextMenuContentOptionStyled';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyContextMenuContentOptionStyledProps } from './HoneyContextMenuContentOptionStyled';

export interface HoneyContextMenuContentOptionProps<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
> extends HoneyContextMenuContentOptionStyledProps {
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

  const isDisabled = isFunction(option.disabled)
    ? option.disabled({ context, floatingContext })
    : option.disabled === true;

  const handleClick = () => {
    if (!isDisabled) {
      option.onClick?.({ context, floatingContext });
    }
  };

  return (
    <HoneyContextMenuContentOptionStyled
      onClick={handleClick}
      // ARIA
      role="menuitem"
      aria-disabled={isDisabled}
      // Data
      data-testid="honey-context-menu-option"
      {...props}
    >
      {option.label}
    </HoneyContextMenuContentOptionStyled>
  );
};
