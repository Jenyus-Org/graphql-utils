import { expect } from "chai";
import { describe } from "mocha";
import { getGraphQLResolveInfo } from "./helpers";
import { resolveFieldMap } from "./resolve-field-map";

describe("Resolving all selected fields in a GraphQL query", () => {
  it("Must work for deeply nested fields and fragments", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        otherField {
          moreUnrelatedFields
          user {
            username
          }
        }
      }
    }`);

    const fields = resolveFieldMap(info);

    expect(fields).to.deep.equal({
      user: {
        otherField: {
          moreUnrelatedFields: {},
          user: {
            username: {},
          },
        },
      },
    });
  });

  it("Must work for deeply nested fields and fragments under a specified parent", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        otherField {
          moreUnrelatedFields
          user {
            username
          }
        }
      }
    }`);

    const fields = resolveFieldMap(info, true, "user.otherField");

    expect(fields).to.deep.equal({
      moreUnrelatedFields: {},
      user: {
        username: {},
      },
    });
  });

  it("Must work for a flat selection fields", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        otherField {
          moreUnrelatedFields
          user {
            username
          }
        }
      }
    }`);

    const fields = resolveFieldMap(info, false);

    expect(fields).to.deep.equal({ user: {} });
  });

  it("Must work with inline fragments", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        ...on User {
          id
          username
          firstName
          lastName
        }
      }
    }`);

    const fields = resolveFieldMap(info);

    expect(fields).to.deep.equal({
      user: { id: {}, username: {}, firstName: {}, lastName: {} },
    });
  });
});
