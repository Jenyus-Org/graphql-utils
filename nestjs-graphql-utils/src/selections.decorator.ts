import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { FieldSelections, resolveSelections } from "@jenyus-org/graphql-utils";

export const Selections = (
  fieldSelections: string | (string | FieldSelections)[],
  fields?: (string | FieldSelections)[],
  withParent: boolean = false
) => {
  if (typeof fieldSelections === "string" && !fields) {
    throw new TypeError(
      "Fields as a list of strings must be given if the parent field is specified as a string in the first argument."
    );
  }

  return createParamDecorator<
    {
      fieldSelections: string | (string | FieldSelections)[];
      fields?: (string | FieldSelections)[];
      withParent: boolean;
    },
    ExecutionContext,
    string[]
  >(({ fieldSelections, fields, withParent }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();

    if (typeof fieldSelections === "string") {
      return resolveSelections(
        [
          {
            field: fieldSelections,
            selections: withParent
              ? fields.map((f) =>
                  typeof f === "string"
                    ? {
                        field: f,
                        selector: [
                          ...fieldSelections.split("."),
                          ...f.split("."),
                        ].join("."),
                      }
                    : f
                )
              : fields,
          },
        ],
        info
      );
    } else {
      return resolveSelections(fieldSelections, info);
    }
  })({ fieldSelections, fields, withParent });
};
