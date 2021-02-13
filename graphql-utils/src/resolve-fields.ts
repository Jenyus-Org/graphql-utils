import { GraphQLResolveInfo } from "graphql";
import { fieldMapToDot } from "./helpers";
import { resolveFieldMap } from "./resolve-field-map";

export const resolveFields = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  parent: string | string[] = [],
  deep: boolean = true
) => {
  const fieldMap = resolveFieldMap(info, parent, deep);
  return fieldMapToDot(fieldMap);
};
