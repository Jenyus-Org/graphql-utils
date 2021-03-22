type Primitive = string | number | Symbol | boolean | Date | null;

type D<P extends string, C extends string> = string & (P extends "" ? P : C);

type Next<N extends number = 0> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  any
][N];

type KeyMap<
  T extends { [key: string]: any },
  SKIP = never,
  C extends string = ".",
  PX extends string = "",
  I extends number = 0
> = keyof {
  [P in keyof T as T[P] extends Primitive | SKIP | I
    ? `${PX}${D<PX, C>}${string & P}`
    : T[P] extends Array<any>
    ?
        | `${PX}${D<PX, C>}${string & P}`
        | KeyMap<
            T[P][number],
            SKIP,
            C,
            `${PX}${D<PX, C>}${string & P}`,
            Next<I>
          >
    :
        | `${PX}${D<PX, C>}${string & P}`
        | KeyMap<
            T[P],
            SKIP,
            C,
            `${PX}${D<PX, C>}${string & P}`,
            Next<I>
          >]: T[P];
};
