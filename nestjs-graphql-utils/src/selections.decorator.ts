import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { FieldSelections, resolveSelections } from "@jenyus-org/graphql-utils";

export const Selections = (
  fieldSelections: string | FieldSelections[],
  fields?: string[],
  asParent: boolean = true
) => {
  if (typeof fieldSelections === "string" && !fields) {
    throw new TypeError(
      "Fields as a list of strings must be given if the parent field is specified as a string in the first argument."
    );
  }

  return createParamDecorator<
    { fieldSelections: string | FieldSelections[]; fields?: string[] },
    ExecutionContext,
    string[]
  >(({ fieldSelections, fields }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();

    if (typeof fieldSelections === "string") {
      return resolveSelections(
        [
          {
            field: fieldSelections,
            selections: asParent
              ? fields.map((f) => ({
                  field: f,
                  selector: [
                    ...fieldSelections.split("."),
                    ...f.split("."),
                  ].join("."),
                }))
              : fields,
          },
        ],
        info
      );
    } else {
      return resolveSelections(fieldSelections, info);
    }
  })({ fieldSelections, fields });
};
