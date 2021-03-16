---
title: Interfaces
---

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
