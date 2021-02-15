import { expect } from "chai";
import { describe } from "mocha";
import { getFieldMap } from "./get-field-map";

describe("Getting a field map within another field map", () => {
  it("Must retrieve the field map under the specified parent", () => {
    const fieldMap = {
      user: {
        otherField: {
          moreUnrelatedFields: {},
          user: {
            username: {},
          },
        },
      },
    };

    const subFieldMap = getFieldMap(fieldMap, "user.otherField");

    expect(subFieldMap).to.deep.equal({
      moreUnrelatedFields: {},
      user: {
        username: {},
      },
    });
  });
});
