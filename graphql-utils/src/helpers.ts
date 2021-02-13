import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
  parse,
} from "graphql";

export interface FieldSelections {
  field: string;
  selector?: string;
  selections?: (string | FieldSelections)[];
}

export function getGraphQLResolveInfo(query: string) {
  const { definitions } = parse(query);
  const operation = definitions.find(
    ({ kind }) => kind === "OperationDefinition"
  );

  const {
    selectionSet: { selections },
  } = operation as OperationDefinitionNode;

  const fragments = definitions
    .filter(({ kind }) => kind === "FragmentDefinition")
    .reduce(
      (result, current) => ({
        ...result,
        [(current as FragmentDefinitionNode).name.value]: current,
      }),
      {}
    );

  const info = {
    fragments,
    fieldNodes: selections as FieldNode[],
  };

  return (info as unknown) as GraphQLResolveInfo;
}

export interface FragmentDict {
  [key: string]: FragmentDefinitionNode;
}

export interface FieldMap {
  [key: string]: FieldMap;
}

export function fieldMapToDot(
  fieldMap: FieldMap,
  dots: string[] = [],
  parent: string[] = []
) {
  for (const key of Object.keys(fieldMap)) {
    dots = [...dots, [...parent, key].join(".")];
    if (fieldMap[key]) {
      dots = fieldMapToDot(fieldMap[key], dots, [...parent, key]);
    }
  }
  return dots;
}
