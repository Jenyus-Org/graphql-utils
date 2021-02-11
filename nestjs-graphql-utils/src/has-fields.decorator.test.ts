import { expect } from "chai";
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
  parse,
} from "graphql";
import { describe } from "mocha";
import { HasFields } from "./has-fields.decorator";
import { getParamDecoratorFactory } from "./helpers";
import * as httpMock from "node-mocks-http";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must work for deeply nested selectors.", () => {
    const query = `{
      user {
        username
        firstName
        lastName
      }
    }`;
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

    const info = ({
      fragments,
      fieldNodes: selections as FieldNode[],
    } as unknown) as GraphQLResolveInfo;

    const factory = getParamDecoratorFactory(HasFields);

    const req = httpMock.createRequest();

    const res = httpMock.createResponse();
    const ctx = new ExecutionContextHost([req, res, null, info]);

    const fieldsFound = factory(
      ["user.username", "user.firstName", "user.lastName"],
      ctx
    );

    expect(fieldsFound).to.equal(true);
  });
});
