import React from 'react';
import type { ReferenceType } from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyPopup } from '../HoneyPopup';
import { HoneyContextMenuContent } from './HoneyContextMenuContent';
import type { HoneyPopupProps } from '../HoneyPopup';
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
  options,
  renderOption,
  optionProps,
  referenceUserProps,
  roleOptions,
  optionsProps,
  context,
  ...props
}: HoneyContextMenuProps<Option, Context, Reference, UseAutoSize>) => {
  return (
    <HoneyPopup
      context={context}
      referenceUserProps={{
        onClick: e => e.stopPropagation(),
        ...referenceUserProps,
      }}
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
    />
  );
};
