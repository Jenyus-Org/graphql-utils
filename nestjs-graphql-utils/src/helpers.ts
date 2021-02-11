import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
  parse,
} from "graphql";
import * as httpMock from "node-mocks-http";
import "reflect-metadata";
import { HasFields } from "./has-fields.decorator";

export function getParamDecoratorFactory(decorator: Function) {
  class Test {
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
  return args[Object.keys(args)[0]].factory;
}

export function getGraphQLResolveInfo(query: string) {
  const { definitions } = parse(query);
  const operation = definitions.find(
    ({ kind }) => kind === "OperationDefinition"
  );

  const {
    selectionSet: { selections },
  } = operation as OperationDefinitionNode;

  const fragments = definitions
    .filter(({ kind }) => kind === "FragmentDefinition")
    .reduce(
      (result, current) => ({
        ...result,
        [(current as FragmentDefinitionNode).name.value]: current,
      }),
      {}
    );

  const info = {
    fragments,
    fieldNodes: selections as FieldNode[],
  };

  return (info as unknown) as GraphQLResolveInfo;
}

export function getGqlExecutionContext(query: string) {
  const req = httpMock.createRequest();
  const res = httpMock.createResponse();

  const info = getGraphQLResolveInfo(query);

  return new ExecutionContextHost([req, res, null, info]);
}
