import type { ReactNode } from 'react';
import type { FloatingContext, ReferenceType } from '@floating-ui/react';

interface HoneyContextMenuOptionExecutionContext<Context, Reference extends ReferenceType> {
  context: Context | undefined;
  floatingContext: FloatingContext<Reference>;
}

export interface HoneyContextMenuOption<
  Context = undefined,
  Reference extends ReferenceType = ReferenceType,
> {
  id: string;
  label: string;
  options?: HoneyContextMenuOption<Context, Reference>[];
  visible?:
    | boolean
    | ((executionContext: HoneyContextMenuOptionExecutionContext<Context, Reference>) => boolean);
  disabled?:
    | boolean
    | ((executionContext: HoneyContextMenuOptionExecutionContext<Context, Reference>) => boolean);
  onClick?: (executionContext: HoneyContextMenuOptionExecutionContext<Context, Reference>) => void;
}

interface RenderOptionExecutionContext<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
> {
  option: Option;
  context: Context | undefined;
  isDisabled: boolean;
}

export type HoneyContextMenuRenderOptionHandler<
  Option extends HoneyContextMenuOption<Context, Reference>,
  Context,
  Reference extends ReferenceType,
> = (executionContext: RenderOptionExecutionContext<Option, Context, Reference>) => ReactNode;
