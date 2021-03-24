import { FieldNode, GraphQLResolveInfo, SelectionNode } from "graphql";

export const getFieldNode = (
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  path: string | string[] = []
): FieldNode | undefined => {
  const { fieldNodes, fragments } = info;
  const fields = Array.isArray(path) ? [...path] : path.split(".");

  let selectionNodes: SelectionNode[] = [...fieldNodes];
  while (selectionNodes.length) {
    const currentNodes = [...selectionNodes];
    selectionNodes = [];

    const field = fields[0];

    let found = false;
    let fragmentFound = false;
    for (const selectionNode of currentNodes) {
      if (selectionNode.kind === "Field") {
        if (selectionNode.name.value === field) {
          if (!found) {
            found = true;
            fields.shift();
          }
          if (!fields.length) {
            return selectionNode;
          }
          if (selectionNode.selectionSet) {
            selectionNodes = [
              ...selectionNodes,
              ...selectionNode.selectionSet.selections,
            ];
          }
        }
      } else if (selectionNode.kind === "FragmentSpread") {
        fragmentFound = true;
        const fragment = fragments[selectionNode.name.value];
        selectionNodes = [
          ...selectionNodes,
          ...fragment.selectionSet.selections,
        ];
      } else {
        fragmentFound = true;
        selectionNodes = [
          ...selectionNodes,
          ...selectionNode.selectionSet.selections,
        ];
      }
    }

    if (!found && !fragmentFound) {
      return;
    }
  }
};
