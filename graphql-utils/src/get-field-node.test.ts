import { expect } from "chai";
import { FieldNode } from "graphql";
import { describe } from "mocha";
import { getFieldNode } from "./get-field-node";
import { getGraphQLResolveInfo } from "./helpers";

describe("Retrieving field nodes from a selected path", () => {
  it("Must work with multiple similar paths", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        profileOne: profile {
          slug
        }
        profileTwo: profile {
          img {
            src
          }
        }
      }
    }`);

    const fieldNode = getFieldNode(info, "user.profile.img");

    expect(fieldNode.kind).to.equal("Field");
    expect(fieldNode.selectionSet.kind).to.equal("SelectionSet");
    expect(fieldNode.selectionSet.selections[0].kind).to.equal("Field");
    expect(
      (fieldNode.selectionSet.selections[0] as FieldNode).name.value
    ).to.equal("src");
  });

  it("Must not skip paths", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        profile {
          imgs {
            icon {
              src
            }
          }
        }
      }
    }`);

    const fieldNode = getFieldNode(info, "user.profile.icon");

    expect(fieldNode).to.be.undefined;
  });

  it("Must work for inline fragment selections", () => {
    const info = getGraphQLResolveInfo(`{
      user {
        ... on User {
          profile {
            imgs {
              icon {
                src
              }
            }
          }
        }
      }
    }`);

    const fieldNode = getFieldNode(info, "user.profile.imgs.icon");

    expect(fieldNode.kind).to.equal("Field");
    expect(fieldNode.selectionSet.kind).to.equal("SelectionSet");
    expect(fieldNode.selectionSet.selections[0].kind).to.equal("Field");
    expect(
      (fieldNode.selectionSet.selections[0] as FieldNode).name.value
    ).to.equal("src");
  });
});
