import React, { useMemo } from 'react';
import { safePolygon } from '@floating-ui/react';

import { HoneyList } from '../HoneyList';
import { HoneyPopup, useHoneyPopupContext } from '../HoneyPopup';
import { HoneyContextMenuContentOption } from './HoneyContextMenuContentOption';
import type { HoneyContextMenuOption } from './HoneyContextMenu.types';
import type { HoneyContextMenuContentOptionProps } from './HoneyContextMenuContentOption';

export interface HoneyContextMenuContentProps<
  Option extends HoneyContextMenuOption<Context>,
  Context,
> {
  options: Option[] | undefined;
  optionProps?: Omit<HoneyContextMenuContentOptionProps<Option, Context>, 'option'>;
}

export const HoneyContextMenuContent = <
  Option extends HoneyContextMenuOption<Context>,
  Context = undefined,
>({
  options,
  optionProps,
}: HoneyContextMenuContentProps<Option, Context>) => {
  const { context } = useHoneyPopupContext();

  const visibleOptions = useMemo<Option[] | undefined>(
    () =>
      options?.filter(option =>
        typeof option.isVisible === 'function'
          ? option.isVisible({ context })
          : option.isVisible !== false,
      ),
    [options],
  );

  return (
    <HoneyList items={visibleOptions} itemKey="id" noContent="No options">
      {option =>
        option.options?.length ? (
          <HoneyPopup
            context={context}
            content={<HoneyContextMenuContent options={option.options} optionProps={optionProps} />}
            event="hover"
            floatingOptions={{
              placement: 'right-start',
            }}
            hoverOptions={{
              handleClose: safePolygon(),
            }}
            contentProps={{
              $width: '150px',
              $maxHeight: '300px',
              $borderRadius: '4px',
              $backgroundColor: 'white',
            }}
            showArrow={true}
            $width="100%"
          >
            {({ getReferenceProps }) => (
              <HoneyContextMenuContentOption
                option={option as HoneyContextMenuOption<any>}
                {...optionProps}
                {...getReferenceProps()}
              >
                {option.label}
              </HoneyContextMenuContentOption>
            )}
          </HoneyPopup>
        ) : (
          <HoneyContextMenuContentOption
            option={option as HoneyContextMenuOption<any>}
            {...optionProps}
          />
        )
      }
    </HoneyList>
  );
};
