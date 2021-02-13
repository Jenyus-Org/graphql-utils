import { expect } from "chai";
import { describe } from "mocha";
import { FieldMap } from "./field-map.decorator";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";

describe("Retrieving a FieldMap from the GraphQLResolveInfo.", () => {
  it("Must resolve all fields.", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        username
        firstName
        lastName
      }
    }`);

    const fieldMap = getParamDecoratorFactory(FieldMap);

    const resolvedFieldMap = fieldMap(
      {
        deep: true,
        parents: [],
      },
      ctx
    );

    expect(resolvedFieldMap).to.deep.equal({
      user: {
        username: {},
        firstName: {},
        lastName: {},
      },
    });
  });
});
