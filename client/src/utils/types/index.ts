import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/system";

export type WithChildren<T = Record<string, unknown>> = T & {
  children?: ReactNode;
};

export type LocationType = { SRID: number; X: number; Y: number };

// Type used to make a collection of SxProps, used for styling Material UI components. This allows you to specify all "classes" in one variable
export type Sx = Record<string, SxProps<Theme>>;

export type GetNullable<T, Prop extends keyof NonNullable<T>> =
  | NonNullable<T>[Prop]
  | null;

// Returns T type with selected optional K fields
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Returns T type with selected required K fields
export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
