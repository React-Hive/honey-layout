import React, { useEffect, useState } from 'react';

import { Button } from './components';
import { HoneyBox, HoneyFlexBox, HoneyPopup } from '../../../components';
import { useHoneyLayout } from '../../../hooks';

const PopupContent = () => {
  const { resolveSpacing } = useHoneyLayout();

  const [length, setLength] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      // setLength(15);
    }, 1500);
  }, []);

  return (
    <HoneyFlexBox $gap={0.5} $height="100%" $padding={1} $overflow="auto">
      {Array.from({ length }).map((_, i) => (
        <HoneyPopup
          key={i}
          content={1}
          event="hover"
          floatingOptions={{
            placement: 'right',
          }}
          offsetOptions={resolveSpacing(2, null)}
          contentProps={{
            $width: '150px',
            $borderRadius: '4px',
            $backgroundColor: 'white',
          }}
          showArrow={true}
          $width="100%"
        >
          {({ referenceProps }) => (
            <HoneyBox
              key={i}
              $display="flex"
              $gap={1}
              $width="100%"
              $padding={[0.5, 1]}
              tabIndex={0}
              {...referenceProps}
            >
              Option {i + 1}
            </HoneyBox>
          )}
        </HoneyPopup>
      ))}
    </HoneyFlexBox>
  );
};

export const HoneyPopupBasicExample = () => {
  return (
    <HoneyBox $marginTop={2} $padding={2} $border="1px solid #cccccc" $borderRadius="4px">
      <HoneyPopup
        content={<PopupContent />}
        floatingOptions={{
          placement: 'top',
        }}
        contentProps={{
          $width: '150px',
          $minHeight: '50px',
          $maxHeight: '300px',
          $borderRadius: '4px',
          $backgroundColor: 'white',
        }}
        showArrow={true}
      >
        {({ referenceProps }) => (
          <Button $width="120px" {...referenceProps}>
            Open Popup
          </Button>
        )}
      </HoneyPopup>
    </HoneyBox>
  );
};
