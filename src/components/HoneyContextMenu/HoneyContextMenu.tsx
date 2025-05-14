import React from 'react';
import type { ReactNode } from 'react';
import type { ReferenceType } from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyPopup } from '../HoneyPopup';
import { HoneyContextMenuContent } from './HoneyContextMenuContent';
import type { HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyPopupChildrenContextProps } from '../HoneyPopup';
import type { HoneyContextMenuContentProps } from './HoneyContextMenuContent';

export interface HoneyContextMenuProps<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
> extends FastOmit<HoneyPopupProps<Context, Reference, UseAutoSize>, 'content'>,
    Pick<
      HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>,
      'options' | 'optionProps'
    > {
  children: ReactNode | ((context: HoneyPopupChildrenContextProps<Reference>) => ReactNode);
  subProps?: FastOmit<
    HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>,
    'options' | 'optionProps'
  >;
}

export const HoneyContextMenu = <
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
>({
  children,
  subProps,
  options,
  optionProps,
  clickOptions,
  context,
  ...popupProps
}: HoneyContextMenuProps<Option, Context, Reference, UseAutoSize>) => {
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
