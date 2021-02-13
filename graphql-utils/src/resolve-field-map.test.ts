import { expect } from "chai";
import { describe } from "mocha";
import { getGraphQLResolveInfo } from "./helpers";
import { resolveFieldMap } from "./resolve-field-map";

describe("Resolving all selected fields in a GraphQL query.", () => {
  it("Must work for deeply nested fields and fragments.", () => {
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

    expect(fields).to.equal({
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
});
