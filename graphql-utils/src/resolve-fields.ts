import { GraphQLResolveInfo } from "graphql";
import { fieldMapToDot } from "./helpers";
import { resolveFieldMap } from "./resolve-field-map";

export const resolveFields = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  deep: boolean = true,
  parent: string | string[] = []
) => {
  const fieldMap = resolveFieldMap(info, parent, deep);
  return fieldMapToDot(fieldMap);
};
