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
      options={options}
      optionProps={{
        $padding: [0.5, 1],
      }}
      context={context}
    >
      {({ getReferenceProps }) => <div {...getReferenceProps()}>Open Context Menu</div>}
    </HoneyContextMenu>
  );
};
