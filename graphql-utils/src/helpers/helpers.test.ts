import { expect } from "chai";
import { describe } from "mocha";
import { FieldMap, fieldMapToDot } from "./helpers";

describe("Remapping field maps to a string array", () => {
  it("Must work for deeply nested elements", () => {
    const fieldMap: FieldMap = {
      user: {
        tasks: {},
        activities: {
          task: {},
        },
      },
    };

    const dot = fieldMapToDot(fieldMap);
    const expectedDots = [
      "user",
      "user.tasks",
      "user.activities",
      "user.activities.task",
    ];

    expect(dot).to.have.length(expectedDots.length);
    expect(dot).to.have.members(expectedDots);
  });
});
