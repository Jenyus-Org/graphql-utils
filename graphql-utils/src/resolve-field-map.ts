import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { FieldMap, FragmentDict } from "./helpers";

export const resolveFieldMap = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  parent: string | string[] = [],
  deep: boolean = true
) => {
  const { fieldNodes, fragments } = info;
  const parents = Array.isArray(parent) ? [...parent] : parent.split(".");

  return resolveFieldMapRecursively([...fieldNodes], deep, parents, fragments);
};

const resolveFieldMapRecursively = (
  selectionNodes: SelectionNode[],
  deep: boolean,
  parents: string[] = [],
  fragments: FragmentDict,
  fieldMap: FieldMap = {}
) => {
  if (parents.length) {
    for (const selectionNode of selectionNodes) {
      if (selectionNode.kind === "Field") {
        if (selectionNode.name.value === parents[0]) {
          parents.shift();
          if (selectionNode.selectionSet) {
            return resolveFieldMapRecursively(
              [...selectionNode.selectionSet.selections],
              deep,
              parents,
              fragments
            );
          }
        }
      } else if (selectionNode.kind === "FragmentSpread") {
        const fragment = fragments[selectionNode.name.value];
        const res = resolveFieldMapRecursively(
          [...fragment.selectionSet.selections],
          deep,
          parents,
          fragments
        );
        if (res) {
          return res;
        }
      }
    }
    return fieldMap;
  }

  for (const selectionNode of selectionNodes) {
    if (selectionNode.kind === "Field") {
      if (deep && selectionNode.selectionSet) {
        fieldMap[selectionNode.name.value] = resolveFieldMapRecursively(
          [...selectionNode.selectionSet.selections],
          deep,
          parents,
          fragments
        );
      } else {
        fieldMap[selectionNode.name.value] = {};
      }
    } else if (selectionNode.kind === "FragmentSpread") {
      const fragment = fragments[selectionNode.name.value];
      fieldMap = resolveFieldMapRecursively(
        [...fragment.selectionSet.selections],
        deep,
        parents,
        fragments,
        fieldMap
      );
    }
  }

  return fieldMap;
};
