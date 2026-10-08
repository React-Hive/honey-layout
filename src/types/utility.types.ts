/**
 * This file stores generic or helper types that provide utility across multiple files.
 * These types are often unrelated to specific components or business logic.
 * They aim to assist in working with types more effectively and flexibly.
 */

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;

/**
 * Recursively marks every property of `T` as optional.
 *
 * Functions and arrays are kept as they are, so they can only be replaced as a whole.
 *
 * @template T - The type to make deeply partial.
 */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T;
