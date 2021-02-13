import { GraphQLResolveInfo } from "graphql";
import { getFieldMap } from "./get-field-map";
import { fieldMapToDot, FieldSelections } from "./helpers";
import { resolveFieldMap } from "./resolve-field-map";

export const resolveSelections = (
  fields: (string | FieldSelections)[],
  info: GraphQLResolveInfo,
  selections: string[] = [],
  parent?: string
) => {
  let resolvedSelections = [...selections];
  const fieldMap = resolveFieldMap(info);
  const resolvedFields = fieldMapToDot(fieldMap);

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
      const subFieldMap = getFieldMap(fieldMap, parent);
      return [...resolvedSelections, ...Object.keys(subFieldMap)];
    } else if (field === "**") {
      const subFieldMap = getFieldMap(fieldMap, parent);
      const subFields = fieldMapToDot(subFieldMap);
      return [...resolvedSelections, ...subFields];
    }

    if (parent) {
      field = [...parent.split("."), ...field.split(".")].join(".");
    }

    const hasField = resolvedFields.reduce(
      (hf, f) => hf || f.indexOf(field) !== -1,
      false
    );
    if (hasField) {
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
