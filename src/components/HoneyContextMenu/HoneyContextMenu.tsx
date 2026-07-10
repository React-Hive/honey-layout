import React from 'react';
import type { ReactNode } from 'react';
import type { ReferenceType } from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyPopup } from '../HoneyPopup';
import { HoneyContextMenuContent } from './HoneyContextMenuContent';
import type { HoneyPopupContextValue, HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyContextMenuContentProps } from './HoneyContextMenuContent';

export interface HoneyContextMenuProps<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
>
  extends
    FastOmit<HoneyPopupProps<Context, Reference, UseAutoSize>, 'content'>,
    Pick<
      HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>,
      'options' | 'renderOption' | 'optionProps'
    > {
  children: ReactNode | ((context: HoneyPopupContextValue<Context, Reference>) => ReactNode);
  optionsProps?: FastOmit<
    HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>,
    'options' | 'renderOption' | 'optionProps' | 'popupProps'
  >;
}

export const HoneyContextMenu = <
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context = undefined,
  Reference extends ReferenceType = ReferenceType,
  UseAutoSize extends boolean = false,
>({
  children,
  options,
  renderOption,
  optionProps,
  roleOptions,
  optionsProps,
  context,
  ...props
}: HoneyContextMenuProps<Option, Context, Reference, UseAutoSize>) => {
  return (
    <HoneyPopup
      context={context}
      content={
        <HoneyContextMenuContent
          options={options}
          renderOption={renderOption}
          optionProps={optionProps}
          popupProps={props}
          {...optionsProps}
        />
      }
      roleOptions={{
        role: 'menu',
        ...roleOptions,
      }}
      useArrow={true}
      // Data
      data-testid="honey-context-menu"
      {...props}
    >
      {children}
    </HoneyPopup>
  );
};
