import { FieldSelections } from "@jenyus-org/graphql-utils";
import { expect } from "chai";
import { describe } from "mocha";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";
import { Selections } from "./selections.decorator";

describe("Resolving selectors from GraphQL query fields", () => {
  it("Must resolve fields from the GraphQLResolveInfo", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const selections = getParamDecoratorFactory(Selections);

    const resolvedSelections = selections(
      {
        fieldSelections: "user",
        fields: ["username", "firstName", "lastName"],
      },
      ctx
    );

    const expectedSelections = ["username", "firstName", "lastName"];

    expect(resolvedSelections).to.have.length(expectedSelections.length);
    expect(resolvedSelections).to.have.members(expectedSelections);
  });

  it("Must work with mixed strings and FieldSelections", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const selections = getParamDecoratorFactory(Selections);

    const resolvedSelections = selections(
      {
        fieldSelections: "user",
        fields: [
          "username",
          "firstName",
          { field: "lastName", selector: "user.lastName" },
        ],
      },
      ctx
    );

    const expectedSelections = ["username", "firstName", "user.lastName"];

    expect(resolvedSelections).to.have.length(expectedSelections.length);
    expect(resolvedSelections).to.have.members(expectedSelections);
  });

  it("Must resolve fields with the parent prepended to the selector", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const selections = getParamDecoratorFactory(Selections);

    const resolvedSelections = selections(
      {
        fieldSelections: "user",
        fields: ["username", "firstName", "lastName"],
        withParent: true,
      },
      ctx
    );

    const expectedSelections = [
      "user.username",
      "user.firstName",
      "user.lastName",
    ];

    expect(resolvedSelections).to.have.length(expectedSelections.length);
    expect(resolvedSelections).to.have.members(expectedSelections);
  });

  it("Must resolve fields using traditional resolveSelections args", () => {
    const fieldSelections: FieldSelections[] = [
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

    const ctx = getGqlExecutionContext(`{
      user {
        otherField {
          moreUnrelatedFields
          user {
            username
          }
        }
      }
    }`);

    const selections = getParamDecoratorFactory(Selections);

    const resolvedSelections = selections({ fieldSelections }, ctx);
    const expectedSelections = ["user.username"];

    expect(resolvedSelections).to.have.length(expectedSelections.length);
    expect(resolvedSelections).to.have.members(expectedSelections);
  });
});
