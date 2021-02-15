import { expect } from "chai";
import { describe } from "mocha";
import { hasFields } from "./has-fields";
import { getGraphQLResolveInfo } from "./helpers";

describe("Checking if a field exists in a given query", () => {
  it("Must work for deeply nested selectors", () => {
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

    const usernameFound = hasFields(info, "user.username", false);

    expect(usernameFound).to.equal(true);
  });

  it("Shouldn't find fields that don't exist", () => {
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

    const usernameFound = hasFields(info, "user.dummyField");

    expect(usernameFound).to.equal(false);
  });

  it("Shouldn't find fields below root-level if specified", () => {
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

    const usernameFound = hasFields(info, "user.username", true);

    expect(usernameFound).to.equal(false);
  });
});
