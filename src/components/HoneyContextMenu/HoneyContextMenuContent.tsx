import React, { useMemo } from 'react';
import type { ReferenceType } from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyList } from '../HoneyList';
import { HoneyPopup, useHoneyPopupContext } from '../HoneyPopup';
import { HoneyContextMenuContentOption } from './HoneyContextMenuContentOption';
import type { HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyContextMenuContentOptionProps } from './HoneyContextMenuContentOption';

export interface HoneyContextMenuContentProps<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
> extends FastOmit<
    HoneyPopupProps<Context, Reference, UseAutoSize>,
    'children' | 'context' | 'content'
  > {
  options: Option[] | undefined;
  optionProps?: FastOmit<HoneyContextMenuContentOptionProps<Option, Context, Reference>, 'option'>;
}

export const HoneyContextMenuContent = <
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
>({
  options,
  optionProps,
  floatingOptions,
  ...popupProps
}: HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>) => {
  const { contentProps } = popupProps;

  const { context, floatingContext } = useHoneyPopupContext<Context, Reference>();

  const visibleOptions = useMemo<Option[] | undefined>(
    () =>
      options?.filter(option =>
        typeof option.visible === 'function'
          ? option.visible({ context, floatingContext })
          : option.visible !== false,
      ),
    [options],
  );

  return (
    <HoneyList items={visibleOptions} itemKey="id" emptyContent="No options">
      {option =>
        option.options?.length ? (
          <HoneyPopup
            context={context}
            content={
              <HoneyContextMenuContent
                options={option.options}
                optionProps={optionProps}
                contentProps={contentProps}
              />
            }
            event="hover"
            referenceProps={{
              $width: '100%',
            }}
            floatingOptions={{
              placement: 'right-start',
              ...floatingOptions,
            }}
            useArrow={true}
            {...popupProps}
          >
            <HoneyContextMenuContentOption
              option={option as HoneyContextMenuOption<unknown, any>}
              {...optionProps}
            >
              {option.label}
            </HoneyContextMenuContentOption>
          </HoneyPopup>
        ) : (
          <HoneyContextMenuContentOption
            option={option as HoneyContextMenuOption<unknown, any>}
            {...optionProps}
          />
        )
      }
    </HoneyList>
  );
};
