import { GraphQLResolveInfo, SelectionSetNode } from "graphql";
import { FieldMap } from "./helpers";

export const resolveFieldMap = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  deep: boolean = true,
  parent: string | string[] = []
) => {
  const { fieldNodes, fragments } = info;
  let selectionSets: SelectionSetNode[] = [];
  const fieldMap: FieldMap = {};
  const parents = Array.isArray(parent) ? [...parent] : parent.split(".");

  if (parents.length) {
    let found = false;
    for (const fieldNode of fieldNodes) {
      if (fieldNode.name.value === parent[0]) {
        parents.shift();
        selectionSets.push(fieldNode.selectionSet);
        found = true;
        break;
      }
    }
    if (!found) {
      return fieldMap;
    }
  } else {
    for (const fieldNode of fieldNodes) {
      selectionSets.push(fieldNode.selectionSet);
    }
  }

  while (parents.length) {
    const currentSelectionSets = [...selectionSets];
    selectionSets = [];

    let found = false;
    for (const selectionSet of currentSelectionSets) {
      if (selectionSet.selections) {
        for (const selection of selectionSet.selections) {
          if (selection.kind === "Field") {
            if (selection.name.value === parents[0]) {
              parents.shift();
              selectionSets.push(selection.selectionSet);
              found = true;
              break;
            }
          } else if (selection.kind === "FragmentSpread") {
            const fragment = fragments[selection.name.value];
            if (fragment.selectionSet) {
              selectionSets.push(fragment.selectionSet);
              found = true;
            }
          }
        }
      }
      if (found) {
        break;
      }
    }
    if (!found) {
      return fieldMap;
    }
  }

  let currentParent = [];
  while (selectionSets.length) {
    const currentSelectionSets = [...selectionSets];
    selectionSets = [];

    for (const selectionSet of currentSelectionSets) {
      if (selectionSet.selections) {
        for (const selection of selectionSet.selections) {
          if (selection.kind === "Field") {
            if (selection.selectionSet) {
              selectionSets = [...selectionSets, selection.selectionSet];
            }
            fieldMap[selection.name.value] = {};
          }
        }
      }
    }
  }

  return fieldMap;
};
