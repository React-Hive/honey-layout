import React from 'react';
import type { ReactNode } from 'react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyPopup } from '../HoneyPopup';
import { HoneyContextMenuContent } from './HoneyContextMenuContent';
import type { HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyPopupChildrenContextProps } from '../HoneyPopup';
import type { HoneyContextMenuContentProps } from './HoneyContextMenuContent';

export interface HoneyContextMenuProps<
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
  UseAutoSize extends boolean = boolean,
> extends FastOmit<HoneyPopupProps<Context, UseAutoSize>, 'content'>,
    Pick<HoneyContextMenuContentProps<Option, Context>, 'options' | 'optionProps'> {
  children: (context: HoneyPopupChildrenContextProps) => ReactNode;
  subProps?: FastOmit<HoneyContextMenuContentProps<Option, Context>, 'options' | 'optionProps'>;
}

export const HoneyContextMenu = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
  UseAutoSize extends boolean = boolean,
>({
  children,
  subProps,
  options,
  optionProps,
  clickOptions,
  context,
  ...popupProps
}: HoneyContextMenuProps<Option, Context, UseAutoSize>) => {
  const { contentProps } = popupProps;

  return (
    <>
      <HoneyPopup
        context={context}
        content={
          <HoneyContextMenuContent
            options={options}
            optionProps={optionProps}
            contentProps={contentProps}
            {...subProps}
          />
        }
        clickOptions={{
          toggle: false,
          ...clickOptions,
        }}
        useArrow={true}
        {...popupProps}
      >
        {children}
      </HoneyPopup>
    </>
  );
};
