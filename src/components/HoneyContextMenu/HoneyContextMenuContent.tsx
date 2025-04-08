import React, { useMemo } from 'react';

import { HoneyList } from '../HoneyList';
import { HoneyPopup, useHoneyPopupContext } from '../HoneyPopup';
import { HoneyContextMenuContentOption } from './HoneyContextMenuContentOption';
import type { HoneyPopupProps } from '../HoneyPopup';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyContextMenuContentOptionProps } from './HoneyContextMenuContentOption';

export interface HoneyContextMenuContentProps<
  Option extends HoneyContextMenuOption<Context>,
  Context,
> extends Omit<HoneyPopupProps<Context>, 'children' | 'context' | 'content'> {
  options: Option[] | undefined;
  optionProps?: Omit<HoneyContextMenuContentOptionProps<Option, Context>, 'option'>;
}

export const HoneyContextMenuContent = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
>({
  options,
  optionProps,
  floatingOptions,
  ...popupProps
}: HoneyContextMenuContentProps<Option, Context>) => {
  const { contentProps } = popupProps;

  const { context } = useHoneyPopupContext();

  const visibleOptions = useMemo<Option[] | undefined>(
    () =>
      options?.filter(option =>
        typeof option.visible === 'function'
          ? option.visible({ context })
          : option.visible !== false,
      ),
    [options],
  );

  return (
    <HoneyList items={visibleOptions} itemKey="id" noContent="No options">
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
            {({ referenceProps }) => (
              <HoneyContextMenuContentOption
                option={option as HoneyContextMenuOption<unknown>}
                {...optionProps}
                {...referenceProps}
              >
                {option.label}
              </HoneyContextMenuContentOption>
            )}
          </HoneyPopup>
        ) : (
          <HoneyContextMenuContentOption
            option={option as HoneyContextMenuOption<unknown>}
            {...optionProps}
          />
        )
      }
    </HoneyList>
  );
};
