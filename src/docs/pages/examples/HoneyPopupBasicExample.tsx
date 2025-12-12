import React, { useEffect, useState } from 'react';
import { useHoneyStyle } from '@react-hive/honey-style';

import { Button } from './components';
import { HoneyBox, HoneyFlex, HoneyPopup } from '../../../components';

const PopupContent = () => {
  const { resolveSpacing } = useHoneyStyle();

  const [length, setLength] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      // setLength(15);
    }, 1500);
  }, []);

  return (
    <HoneyFlex $gap={0.5} $height="100%" $padding={1} $overflow="auto">
      {Array.from({ length }).map((_, i) => (
        <HoneyPopup
          key={i}
          content={1}
          event="hover"
          floatingOptions={{
            placement: 'right',
          }}
          offsetOptions={resolveSpacing(2, null)}
          referenceProps={{
            $width: '100%',
          }}
          contentProps={{
            $width: '150px',
            $borderRadius: '4px',
            $backgroundColor: 'white',
          }}
          useArrow={true}
        >
          <HoneyBox key={i} $width="100%" $padding={[0.5, 1]} tabIndex={0}>
            Option {i + 1}
          </HoneyBox>
        </HoneyPopup>
      ))}
    </HoneyFlex>
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
        useArrow={true}
        useTree={true}
      >
        <Button $width="120px">Open Popup</Button>
      </HoneyPopup>
    </HoneyBox>
  );
};
