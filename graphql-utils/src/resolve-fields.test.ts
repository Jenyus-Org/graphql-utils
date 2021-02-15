import { expect } from "chai";
import { describe } from "mocha";
import { getGraphQLResolveInfo } from "./helpers";
import { resolveFields } from "./resolve-fields";

describe("Resolving selectors from GraphQL query fields", () => {
  it("Must resolve all deeply nested fields", () => {
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
    const expectedFields = [
      "user",
      "user.otherField",
      "user.otherField.moreUnrelatedFields",
      "user.otherField.user",
      "user.otherField.user.username",
    ];

    expect(deepFields).to.have.length(expectedFields.length);
    expect(deepFields).to.have.members(expectedFields);
  });

  it("Must resolve only flat fields", () => {
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

    const flatFields = resolveFields(info, false, "user");
    const expectedFields = ["otherField"];

    expect(flatFields).to.have.length(expectedFields.length);
    expect(flatFields).to.have.members(expectedFields);
  });

  it("Must resolve all deeply nested fields under a specified parent", () => {
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
    const expectedFields = [
      "otherField",
      "otherField.moreUnrelatedFields",
      "otherField.user",
      "otherField.user.username",
    ];

    expect(userFields).to.have.length(expectedFields.length);
    expect(userFields).to.have.members(expectedFields);
  });

  it("Must resolve only flat fields under a specified parent", () => {
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
    const expectedFields = ["otherField"];

    expect(flatUserFields).to.have.length(expectedFields.length);
    expect(flatUserFields).to.have.members(expectedFields);
  });
});
