import { resolveFieldMap } from "@jenyus-org/graphql-utils";
import { FieldMap as IFieldMap } from "@jenyus-org/graphql-utils/dist/helpers";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const FieldMap = (
  deep: boolean = true,
  parent: string | string[] = []
) => {
  return createParamDecorator<
    {
      deep: boolean;
      parent: string | string[];
    },
    ExecutionContext,
    IFieldMap
  >(({ deep, parent }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    return resolveFieldMap(info, deep, parent);
  })({ deep, parent });
};
