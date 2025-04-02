import React, { useCallback, useState } from 'react';

import { Button } from './components';
import { HoneyBox, HoneyOverlay } from '../../../components';

export const HoneyOverlayBasicExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeactivate = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <HoneyBox $marginTop={2} $padding={2} $border="1px solid #cccccc" $borderRadius="4px">
      <Button onClick={() => setIsOpen(!isOpen)} $width="120px">
        Open Overlay
      </Button>

      <HoneyOverlay
        active={isOpen}
        onDeactivate={handleDeactivate}
        $display={isOpen ? undefined : 'none'}
      >
        <div>This is the overlay content.</div>

        <Button onClick={handleDeactivate} color="default" $width="150px">
          Deactivate Overlay
        </Button>
      </HoneyOverlay>
    </HoneyBox>
  );
};
