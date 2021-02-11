import { expect } from "chai";
import { describe } from "mocha";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";
import { Selections } from "./selections.decorator";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must resolve fields with the parent prepended to the selector.", () => {
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

    const expectedSelections = [
      "user.username",
      "user.firstName",
      "user.lastName",
    ];

    expect(resolvedSelections).to.have.length(expectedSelections.length);
    expect(resolvedSelections).to.have.members(expectedSelections);
  });
});
