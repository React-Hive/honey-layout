import React from 'react';
import type { ReactNode } from 'react';

import { HoneyPopup } from '../HoneyPopup';
import { HoneyContextMenuContent } from './HoneyContextMenuContent';
import type { HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyPopupChildrenContextProps } from '../HoneyPopup';
import type { HoneyContextMenuContentProps } from './HoneyContextMenuContent';

export interface HoneyContextMenuProps<
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
> extends Omit<HoneyPopupProps<Context>, 'content'>,
    Pick<HoneyContextMenuContentProps<Option, Context>, 'options' | 'optionProps'> {
  children: (context: HoneyPopupChildrenContextProps) => ReactNode;
  subProps?: Omit<HoneyContextMenuContentProps<Option, Context>, 'options' | 'optionProps'>;
}

export const HoneyContextMenu = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
>({
  children,
  subProps,
  options,
  optionProps,
  clickOptions,
  context,
  ...popupProps
}: HoneyContextMenuProps<Option, Context>) => {
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
