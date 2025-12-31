const uniqueWarningKeys = new Set<string>();

export const warnOnce = (key: string, message: string) => {
  if (uniqueWarningKeys.has(key)) {
    return;
  }

  uniqueWarningKeys.add(key);

  console.warn(message);
};
