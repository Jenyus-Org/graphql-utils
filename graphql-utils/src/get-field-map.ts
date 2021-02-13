import { FieldMap } from "./helpers";

export const getFieldMap = (fieldMap: FieldMap, parent: string | string[]) => {
  const parents = Array.isArray(parent) ? parent : parent.split(".");
  if (!parents.length) {
    return fieldMap;
  }
  for (const key of Object.keys(fieldMap)) {
    if (key === parents[0]) {
      parents.shift();
      return getFieldMap(fieldMap[key], parents);
    }
  }
};
