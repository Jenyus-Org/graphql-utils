import { expect } from "chai";
import { describe } from "mocha";
import { HasFields } from "./has-fields.decorator";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must work for deeply nested selectors.", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const hasFields = getParamDecoratorFactory(HasFields);

    const fieldsFound = hasFields(
      ["user.username", "user.firstName", "user.lastName"],
      ctx
    );

    expect(fieldsFound).to.equal(true);
  });
});
