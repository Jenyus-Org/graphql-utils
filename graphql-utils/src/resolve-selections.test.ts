import { expect } from "chai";
import {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  OperationDefinitionNode,
  parse,
} from "graphql";
import { describe } from "mocha";
import { FieldSelections, resolveSelections } from "./resolve-selections";

describe("Resolving relationships from GraphQL query fields.", () => {
  it("Should resolve given relations for entered fields.", () => {
    const fields: FieldSelections[] = [
      {
        field: "items",
        selections: ["tasks", "tasks.activities", "tasks.user"],
      },
    ];

    const { definitions } = parse(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
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

    const relations = resolveSelections(
      fields,
      (info as unknown) as GraphQLResolveInfo
    );
    const expectedRelations = ["tasks", "tasks.activities", "tasks.user"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Must work for deeply nested selectors.", () => {
    const fields: FieldSelections[] = [
      {
        field: "user",
        selections: [
          {
            field: "otherField",
            selections: ["user.username"],
          },
        ],
      },
    ];

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

    const relations = resolveSelections(
      fields,
      (info as unknown) as GraphQLResolveInfo
    );
    const expectedRelations = ["user.username"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });
});
