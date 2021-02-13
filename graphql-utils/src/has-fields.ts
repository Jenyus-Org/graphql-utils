import { GraphQLResolveInfo } from "graphql";
import { resolveFields } from "./resolve-fields";

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
  info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">,
  search: string | string[],
  atRoot: boolean = true
) => {
  const field = Array.isArray(search) ? search.join(".") : search;
  const fields = resolveFields(info);

  if (atRoot) {
    return fields.includes(field);
  } else {
    for (const fieldDot of fields) {
      if (fieldDot.indexOf(field) !== -1) {
        return true;
      }
    }
  }
  return false;
};
