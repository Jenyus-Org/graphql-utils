import { expect } from "chai";
import { FieldNode } from "graphql";
import { describe } from "mocha";
import { getFieldNode } from "./get-field-node";
import { getGraphQLResolveInfo } from "./helpers";

describe("Retrieving field nodes from a selected path.", () => {
  it("Must with multiple similar paths.", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        profile {
          img {
            src
          }
        }
        profile {
          slug
        }
      }
    }`);

    const fieldNode = getFieldNode(info, "user.profile.img");

    expect(fieldNode.selectionSet.selections[0].kind).to.equal("Field");
    expect(
      (fieldNode.selectionSet.selections[0] as FieldNode).name.value
    ).to.equal("src");
  });
});
