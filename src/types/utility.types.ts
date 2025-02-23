/**
 * This file stores generic or helper types that provide utility across multiple files.
 * These types are often unrelated to specific components or business logic.
 * They aim to assist in working with types more effectively and flexibly.
 */

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;

/**
 * Extracts the keys from a given type `T` whose values match the specified `Condition`.
 *
 * @template T - The object type from which to extract keys.
 * @template Condition - The condition that the type of the values must satisfy to be included.
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean };
 * type StringKeys = ExtractKeys<Example, string>; // "a"
 * ```
 */
type ExtractKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never;
}[keyof T];

/**
 * Excludes the keys from a given type `T` whose values match the specified `Condition`.
 *
 * @template T - The object type from which to exclude keys.
 * @template Condition - The condition that the type of the values must satisfy to be excluded.
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean };
 * type NonNumberKeys = ExcludeKeys<Example, number>; // "a" | "c"
 * ```
 */
type ExcludeKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? never : K;
}[keyof T];

/**
 * Extracts the keys from a given type `T` where the values are `string`, `null`, or `undefined`.
 *
 * @template T - The object type from which to extract string-related keys.
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: string | null };
 * type StringKeys = KeysWithStringValues<Example>; // "a" | "c"
 * ```
 */
export type KeysWithStringValues<T> = Extract<ExtractKeys<T, string | null | undefined>, string>;

/**
 * Extracts the keys from a given type `T` where the values are arrays (`unknown[]`), `null`, or `undefined`.
 *
 * @template T - The object type from which to extract array-related keys.
 *
 * @example
 * ```ts
 * type Example = { a: string[]; b: number; c: number[] | null };
 * type ArrayKeys = KeysWithArrayValues<Example>; // "a" | "c"
 * ```
 */
export type KeysWithArrayValues<T> = Extract<ExtractKeys<T, unknown[] | null | undefined>, string>;

/**
 * Extracts the keys from a given type `T` where the values are **not** arrays (`unknown[]`), `null`, or `undefined`.
 *
 * @template T - The object type from which to extract non-array keys.
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: string[]; d: null };
 * type NonArrayKeys = KeysWithNonArrayValues<Example>; // "a" | "b"
 * ```
 */
export type KeysWithNonArrayValues<T> = Extract<
  ExcludeKeys<T, unknown[] | null | undefined>,
  string
>;
