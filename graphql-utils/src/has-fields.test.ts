import { expect } from "chai";
import { describe } from "mocha";
import { hasFields } from "./has-fields";
import { getGraphQLResolveInfo } from "./helpers";

describe("Resolving selectors from GraphQL query fields.", () => {
  it("Must work for deeply nested selectors.", () => {
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

    const usernameFound = hasFields("user.username", info);

    expect(usernameFound).to.equal(true);
  });

  it("Shouldn't find fields that don't exist.", () => {
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

    const usernameFound = hasFields("user.dummyField", info);

    expect(usernameFound).to.equal(false);
  });
});
