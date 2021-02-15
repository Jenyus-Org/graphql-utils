import { getFieldNode } from "@jenyus-org/graphql-utils";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { FieldNode } from "graphql";

export const FieldNodeAt = (path: string | string[] = []) => {
  return createParamDecorator<string | string[], ExecutionContext, FieldNode>(
    (path, context) => {
      const ctx = GqlExecutionContext.create(context);
      const info = ctx.getInfo();
      return getFieldNode(info, path);
    }
  )(path);
};
