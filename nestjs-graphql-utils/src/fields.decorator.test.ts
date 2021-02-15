import { expect } from "chai";
import { describe } from "mocha";
import { Fields } from "./fields.decorator";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";

describe("Retrieving fields from the GraphQLResolveInfo in dot notation form", () => {
  it("Must resolve all fields", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const fields = getParamDecoratorFactory(Fields);

    const resolvedFields = fields(
      {
        deep: true,
        parents: [],
      },
      ctx
    );
    const expectedFields = [
      "user",
      "user.username",
      "user.firstName",
      "user.lastName",
    ];

    expect(resolvedFields).to.have.length(expectedFields.length);
    expect(resolvedFields).to.have.members(expectedFields);
  });
});
