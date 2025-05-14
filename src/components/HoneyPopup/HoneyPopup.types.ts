import type { FloatingContext, ReferenceType } from '@floating-ui/react';

export interface HoneyPopupChildrenContextProps<Reference extends ReferenceType> {
  floatingContext: FloatingContext<Reference>;
}
