import { GraphQLResolveInfo } from "graphql";
import { hasFields } from "./has-fields";
import { resolveFields } from "./resolve-fields";

export interface FieldSelections {
  field: string;
  selector?: string;
  selections?: (string | FieldSelections)[];
}

export const resolveSelections = (
  fields: (string | FieldSelections)[],
  info: GraphQLResolveInfo,
  selections: string[] = [],
  parent?: string
) => {
  let resolvedSelections = [...selections];

  for (const fieldSelection of fields) {
    let field: string;
    let selector: string | undefined;

    if (typeof fieldSelection === "string") {
      field = fieldSelection;
      selector = field;
    } else {
      field = fieldSelection.field;
      if (fieldSelection.selector) {
        selector = fieldSelection.selector;
      }
    }

    if (field === "*") {
      return [...resolvedSelections, ...resolveFields(info, false, parent)];
    } else if (field === "**") {
      return [...resolvedSelections, ...resolveFields(info, true, parent)];
    }

    if (parent) {
      field = [...parent.split("."), ...field.split(".")].join(".");
    }

    if (hasFields(field, info)) {
      if (selector) {
        resolvedSelections = [...resolvedSelections, selector];
      }

      if (typeof fieldSelection !== "string" && fieldSelection.selections) {
        resolvedSelections = resolveSelections(
          fieldSelection.selections,
          info,
          resolvedSelections,
          field
        );
      }
    }
  }

  return resolvedSelections;
};
