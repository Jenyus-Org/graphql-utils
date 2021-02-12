import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionSetNode,
} from "graphql";
import { FragmentDict } from "./helpers";

/**
 * Searches the GraphQLResolveInfo for selectors that match the search string or array, and returns `true` if found.
 *
 * Example:
 *
 * ```typescript
 * // Assuming the query { user { username } } was given.
 *
 * const search = "user.username";  // ["user", "username"] would be the equivalent array form
 * const requestedUsername = hasFields(search, info);
 * console.log(requestedUsername);  // true
 * ```
 *
 * @param search A dot separated list of fields to search for in the tree, or array of fields.
 * @param info GraphQLResolveInfo often provided by the GraphQL library itself, can be constructed using graphql/parse.
 * @returns `true` if the fields were located in the query as directly nested selectors, otherwise `false`.
 */
export const hasFields = (
  search: string | string[],
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">
) => {
  const { fieldNodes, fragments } = info;
  const fields = Array.isArray(search) ? search : search.split(".");

  for (const fieldNode of fieldNodes) {
    if (!fieldNode.selectionSet) {
      continue;
    }

    const found = hasFieldName(fieldNode, fields, fragments);
    if (found) {
      return true;
    }
  }

  return false;
};

const hasFieldName = (
  selectionNode: FieldNode | FragmentDefinitionNode,
  search: string[],
  fragments: FragmentDict
) => {
  if (search.length === 0) {
    return true;
  }

  if (selectionNode.name.value === search[0]) {
    search.shift();
    const newSearch = [...search];
    newSearch.shift();
    if (selectionNode.selectionSet) {
      if (hasFieldSet(selectionNode.selectionSet, newSearch, fragments)) {
        return true;
      }
    }
  }

  if (selectionNode.selectionSet) {
    for (const selection of selectionNode.selectionSet.selections) {
      if (selection.kind === "Field") {
        if (hasFieldName(selection, search, fragments)) {
          return true;
        }
      } else if (selection.kind === "FragmentSpread") {
        const fragment = fragments[selection.name.value];
        if (hasFieldName(fragment, search, fragments)) {
          return true;
        }
      }
    }
  }

  return false;
};

const hasFieldSet = (
  selectionSet: SelectionSetNode,
  search: string[],
  fragments: FragmentDict
): boolean => {
  if (search.length === 0) {
    return true;
  }

  for (const selection of selectionSet.selections) {
    if (selection.kind === "Field" && selection.name.value === search[0]) {
      search.shift();
      if (selection.selectionSet) {
        if (hasFieldSet(selection.selectionSet, search, fragments)) {
          return true;
        }
      } else if (search.length === 0) {
        return true;
      }
    } else if (selection.kind === "FragmentSpread") {
      const fragment = fragments[selection.name.value];
      if (hasFieldSet(fragment.selectionSet, search, fragments)) {
        return true;
      }
    }
  }

  return false;
};
