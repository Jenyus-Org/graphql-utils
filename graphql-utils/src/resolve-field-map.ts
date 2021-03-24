import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { getFieldNode } from "./get-field-node";
import { FieldMap, FragmentDict } from "./helpers";

export const resolveFieldMap = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  deep: boolean = true,
  parent: string | string[] = []
) => {
  const { fieldNodes, fragments } = info;
  const parents = Array.isArray(parent) ? [...parent] : parent.split(".");

  if (parents.length) {
    const fieldNode = getFieldNode(info, parents);
    return resolveFieldMapRecursively(
      fieldNode?.selectionSet ? [...fieldNode.selectionSet.selections] : [],
      deep,
      fragments
    );
  }

  return resolveFieldMapRecursively([...fieldNodes], deep, fragments);
};

const resolveFieldMapRecursively = (
  selectionNodes: SelectionNode[],
  deep: boolean,
  fragments: FragmentDict,
  fieldMap: FieldMap = {}
) => {
  for (const selectionNode of selectionNodes) {
    if (selectionNode.kind === "Field") {
      if (deep && selectionNode.selectionSet) {
        fieldMap[selectionNode.name.value] = resolveFieldMapRecursively(
          [...selectionNode.selectionSet.selections],
          deep,
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
        fragments,
        fieldMap
      );
    } else {
      fieldMap = resolveFieldMapRecursively(
        [...selectionNode.selectionSet.selections],
        deep,
        fragments,
        fieldMap
      );
    }
  }

  return fieldMap;
};
