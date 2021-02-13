import { resolveFields } from "@jenyus-org/graphql-utils";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Fields = (
  deep: boolean = true,
  parent: string | string[] = []
) => {
  return createParamDecorator<
    {
      deep: boolean;
      parent: string | string[];
    },
    ExecutionContext,
    string[]
  >(({ deep, parent }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    return resolveFields(info, deep, parent);
  })({ deep, parent });
};
