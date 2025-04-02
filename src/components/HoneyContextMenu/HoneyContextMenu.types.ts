interface HoneyContextMenuOptionExecutionContext<Context> {
  context: Context | undefined;
}

export interface HoneyContextMenuOption<Context = undefined> {
  id: string;
  label: string;
  options?: HoneyContextMenuOption<Context>[];
  isVisible?:
    | boolean
    | ((executionContext: HoneyContextMenuOptionExecutionContext<Context>) => boolean);
  onClick?: (executionContext: HoneyContextMenuOptionExecutionContext<Context>) => void;
}
