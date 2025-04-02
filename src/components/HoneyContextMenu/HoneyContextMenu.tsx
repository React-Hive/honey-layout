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
> extends Pick<HoneyPopupProps<Context>, 'context'>,
    HoneyContextMenuContentProps<Option, Context> {
  children: (context: HoneyPopupChildrenContextProps) => ReactNode;
}

export const HoneyContextMenu = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
>({
  children,
  options,
  optionProps,
  context,
}: HoneyContextMenuProps<Option, Context>) => {
  return (
    <>
      <HoneyPopup
        context={context}
        content={<HoneyContextMenuContent options={options} optionProps={optionProps} />}
        floatingOptions={{
          placement: 'top',
        }}
        contentProps={{
          $width: '150px',
          $maxHeight: '300px',
          $borderRadius: '4px',
          $backgroundColor: 'white',
        }}
        showArrow={true}
      >
        {children}
      </HoneyPopup>
    </>
  );
};
