import { expect } from "chai";
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
  parse,
} from "graphql";
import { describe } from "mocha";
import { hasFields } from "./has-fields";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must work for deeply nested selectors.", () => {
    const { definitions } = parse(`{
      user {
        otherField {
          moreUnrelatedFields
          user {
            username
          }
        }
      }
    }`);
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

    const usernameFound = hasFields(
      "user.username",
      (info as unknown) as GraphQLResolveInfo
    );

    expect(usernameFound).to.equal(true);
  });
});
