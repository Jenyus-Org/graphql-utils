---
title: Interfaces
---

Overview of the interfaces built into the `@jenyus-org/graphql-utils` package.

## `FieldMap`

```ts
interface FieldMap {
  [key: string]: FieldMap;
}
```

## `FieldSelections`

```ts
interface FieldSelections {
  field: string;
  selector?: string;
  selections?: (string | FieldSelections)[];
}
```
