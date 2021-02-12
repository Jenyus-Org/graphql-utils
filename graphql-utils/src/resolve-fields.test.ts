import { expect } from "chai";
import { describe } from "mocha";
import { getGraphQLResolveInfo } from "./helpers";
import { resolveFields } from "./resolve-fields";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must resolve all deeply nested fields.", () => {
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

    const deepFields = resolveFields(info);
    console.log(deepFields);

    expect(deepFields).to.equal(true);
  });

  it("Must resolve only flat fields.", () => {
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

    const flatFields = resolveFields(info, false);
    console.log(flatFields);

    expect(flatFields).to.equal(true);
  });

  it("Must resolve all deeply nested fields under a specified parent.", () => {
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

    const userFields = resolveFields(info, true, "user");
    console.log(userFields);

    expect(userFields).to.equal(true);
  });

  it("Must resolve only flat fields under a specified parent.", () => {
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

    const flatUserFields = resolveFields(info, false, "user");
    console.log(flatUserFields);

    expect(flatUserFields).to.equal(true);
  });
});
