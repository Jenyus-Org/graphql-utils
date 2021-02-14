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
    for (const selectionNode of currentNodes) {
      let found = false;
      if (selectionNode.kind === "Field") {
        if (selectionNode.name.value === fields[0]) {
          if (!found) {
            fields.shift();
            found = true;
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
        const fragment = fragments[selectionNode.name.value];
        selectionNodes = [
          ...selectionNodes,
          ...fragment.selectionSet.selections,
        ];
      }
    }
  }
};
