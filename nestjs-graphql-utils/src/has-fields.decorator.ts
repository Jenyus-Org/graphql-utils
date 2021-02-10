import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { hasFields } from "@jenyus-org/graphql-utils";

export const HasFields = (...fields: string[]) => {
  return createParamDecorator<string[], ExecutionContext, boolean>(
    (search, context) => {
      const ctx = GqlExecutionContext.create(context);
      const info = ctx.getInfo();
      for (const field of search) {
        if (!hasFields(field, info)) {
          return false;
        }
      }
      return true;
    }
  )(fields);
};
