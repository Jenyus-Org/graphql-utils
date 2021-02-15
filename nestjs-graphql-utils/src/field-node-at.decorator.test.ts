import { expect } from "chai";
import { FieldNode } from "graphql";
import { describe } from "mocha";
import { FieldNodeAt } from "./field-node-at.decorator";
import { getGqlExecutionContext, getParamDecoratorFactory } from "./helpers";

describe("Retrieving a field node by its specified path", () => {
  it("Must work with multiple similar selectors", () => {
    const ctx = getGqlExecutionContext(`{
      user {
        profile {
          slug
        }
        profile {
          img {
            src
          }
        }
      }
    }`);

    const fieldNodeAt = getParamDecoratorFactory(FieldNodeAt);

    const fieldNode = fieldNodeAt("user.profile.img", ctx);

    expect(fieldNode.kind).to.equal("Field");
    expect(fieldNode.selectionSet.kind).to.equal("SelectionSet");
    expect(fieldNode.selectionSet.selections[0].kind).to.equal("Field");
    expect(
      (fieldNode.selectionSet.selections[0] as FieldNode).name.value
    ).to.equal("src");
  });
});
