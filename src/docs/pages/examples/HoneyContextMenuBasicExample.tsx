import React, { useMemo } from 'react';

import { HoneyContextMenu } from '../../../components';
import type { HoneyContextMenuOption } from '../../../components';

export const HoneyContextMenuBasicExample = () => {
  const context = useMemo(
    () => ({
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    }),
    [],
  );

  const options = useMemo<HoneyContextMenuOption<typeof context>[]>(
    () => [
      {
        id: 'option-1',
        label: 'Option 1',
      },
      {
        id: 'option-2',
        label: 'Option 2',
        options: [
          {
            id: 'option-2-1',
            label: 'Option 2-1',
          },
          {
            id: 'option-2-2',
            label: 'Option 2-2',
          },
          {
            id: 'option-2-3',
            label: 'Option 2-3',
            options: [
              {
                id: 'option-2-3-1',
                label: 'Option 2-3-1',
                onClick: ({ context }) => {
                  //
                },
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  return (
    <HoneyContextMenu
      context={context}
      options={options}
      optionProps={{
        $padding: [0.5, 1],
      }}
      contentProps={{
        $width: '150px',
        $maxHeight: '300px',
        $borderRadius: '4px',
        $backgroundColor: 'white',
      }}
      floatingOptions={{
        placement: 'top',
      }}
      subProps={{
        event: 'click',
      }}
    >
      {({ referenceProps }) => <div {...referenceProps}>Open Context Menu</div>}
    </HoneyContextMenu>
  );
};
