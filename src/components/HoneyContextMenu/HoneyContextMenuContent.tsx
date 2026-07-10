import React, { useMemo } from 'react';
import { isFunction } from '@react-hive/honey-utils';
import type { ReactNode } from 'react';
import type { ReferenceType } from '@floating-ui/react';
import type { FastOmit } from '@react-hive/honey-style';

import { HoneyList, HoneyListProps } from '../HoneyList';
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
> extends FastOmit<HoneyListProps<Option>, 'children' | 'items' | 'itemKey'> {
  options: Option[] | undefined;
  renderOption?: (option: Option) => ReactNode;
  optionProps?: FastOmit<
    HoneyContextMenuContentOptionProps<Option, Context, Reference>,
    'option' | 'renderOption'
  >;
  popupProps?: FastOmit<
    HoneyPopupProps<Context, Reference, UseAutoSize>,
    'children' | 'context' | 'content'
  >;
}

export const HoneyContextMenuContent = <
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
>({
  options,
  renderOption,
  optionProps,
  popupProps,
  ...props
}: HoneyContextMenuContentProps<Option, Context, Reference, UseAutoSize>) => {
  const { floatingOptions } = popupProps ?? {};

  const { context, floatingContext } = useHoneyPopupContext<Context, Reference>();

  const visibleOptions = useMemo<Option[] | undefined>(
    () =>
      options?.filter(option =>
        isFunction(option.visible)
          ? option.visible({ context, floatingContext })
          : option.visible !== false,
      ),
    [options],
  );

  return (
    <HoneyList
      items={visibleOptions}
      itemKey="id"
      // Data
      data-testid="honey-context-menu-options"
      {...props}
    >
      {option =>
        option.options?.length ? (
          <HoneyPopup
            context={context}
            content={
              <HoneyContextMenuContent
                options={option.options as Option[]}
                renderOption={renderOption}
                optionProps={optionProps}
                popupProps={popupProps}
                {...props}
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
            // Data
            data-testid="honey-sub-context-menu"
            {...popupProps}
          >
            <HoneyContextMenuContentOption<Option, Context, Reference>
              option={option}
              renderOption={renderOption}
              {...optionProps}
            />
          </HoneyPopup>
        ) : (
          <HoneyContextMenuContentOption<Option, Context, Reference>
            option={option}
            renderOption={renderOption}
            {...optionProps}
          />
        )
      }
    </HoneyList>
  );
};
