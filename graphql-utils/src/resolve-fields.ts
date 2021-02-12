import { FieldNode, FragmentDefinitionNode, GraphQLResolveInfo } from "graphql";
import { FragmentDict } from "./helpers";

export const resolveFields = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  deep: boolean = true,
  parent: string | string[] = "",
  fields: string[] = []
) => {
  const { fieldNodes, fragments } = info;

  for (const fieldNode of fieldNodes) {
    if (!parent) {
      fields = [...fields, fieldNode.name.value];
    }
    const resolvedFields = resolveFieldsFromSelectionSet(
      fieldNode,
      deep,
      parent,
      fragments,
      [fieldNode.name.value]
    );
    fields = [...fields, ...resolvedFields];
  }

  return fields;
};

const resolveFieldsFromSelectionSet = (
  selectionNode: FieldNode | FragmentDefinitionNode,
  deep: boolean = true,
  parent: string | string[] = "",
  fragments: FragmentDict,
  fieldParent: string[] = [],
  fields: string[] = []
) => {
  if (parent) {
    console.log(parent);
    const parents = Array.isArray(parent) ? parent : parent.split(".");
    for (const fieldNode of selectionNode.selectionSet.selections) {
      if (fieldNode.kind === "Field") {
        if (fieldNode.name.value === parents[0]) {
          console.log(fieldNode);
          parents.shift();
          const resolvedFields = resolveFieldsFromSelectionSet(
            fieldNode,
            deep,
            parents.join("."),
            fragments,
            [...fieldParent, fieldNode.name.value]
          );
          fields = [...fields, ...resolvedFields];
        }
      }
    }
    return fields;
  }

  if (selectionNode.selectionSet) {
    for (const selection of selectionNode.selectionSet.selections) {
      if (selection.kind === "Field") {
        console.log(selection.name.value);
        const field = [...fieldParent, selection.name.value].join(".");
        fields = [...fields, field];
        if (deep) {
          const resolvedFields = resolveFieldsFromSelectionSet(
            selection,
            deep,
            parent,
            fragments,
            [...fieldParent, selection.name.value]
          );
          fields = [...fields, ...resolvedFields];
        }
      } else if (selection.kind === "FragmentSpread") {
        const fragment = fragments[selection.name.value];
        const resolvedFields = resolveFieldsFromSelectionSet(
          fragment,
          deep,
          parent,
          fragments,
          [...fieldParent, selection.name.value]
        );
        fields = [...fields, ...resolvedFields];
      }
    }
  }

  return fields;
};
