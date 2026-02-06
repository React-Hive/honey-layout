/**
 * This file stores generic or helper types that provide utility across multiple files.
 * These types are often unrelated to specific components or business logic.
 * They aim to assist in working with types more effectively and flexibly.
 */

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;
