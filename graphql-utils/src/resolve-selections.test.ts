import { expect } from "chai";
import { describe } from "mocha";
import { FieldSelections, getGraphQLResolveInfo } from "./helpers";
import { resolveSelections } from "./resolve-selections";

describe("Resolving relationships from GraphQL query fields", () => {
  it("Should resolve given relations for entered fields", () => {
    const fields: FieldSelections[] = [
      {
        field: "items",
        selections: ["tasks", "tasks.activities", "tasks.user"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["tasks", "tasks.activities", "tasks.user"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Must work for deeply nested selectors", () => {
    const fields: FieldSelections[] = [
      {
        field: "user",
        selections: [
          {
            field: "otherField",
            selections: ["user.username", "dummyField"],
          },
        ],
      },
    ];

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

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["user.username"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Should resolve wildcards", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects",
        selections: ["*"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["id", "items"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Should resolve deep wildcards", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects",
        selections: ["*.*"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = [
      "id",
      "items",
      "items.tasks",
      "items.tasks.activities",
      "items.tasks.activities.id",
      "items.tasks.user",
      "items.tasks.user.id",
    ];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Should resolve wildcards for fields with subselections", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects",
        selections: ["**"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["items"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Should resolve wildcards for fields with subselections", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects.items.tasks",
        selections: ["**"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["activities", "user"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });

  it("Should resolve wildcards for fields without subselections", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects",
        selections: ["*."],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = ["id"];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });
  it("Should resolve wildcards for deep fields with subselections", () => {
    const fields: FieldSelections[] = [
      {
        field: "projects",
        selections: ["**.**"],
      },
    ];

    const info = getGraphQLResolveInfo(`{
      projects(search: "Test") {
        id
        items {
          tasks {
            activities {
              id
            }
            user {
              id
            }
          }
        }
      }
    }`);

    const relations = resolveSelections(fields, info);
    const expectedRelations = [
      "items",
      "items.tasks",
      "items.tasks.activities",
      "items.tasks.user",
    ];

    expect(relations).to.have.length(expectedRelations.length);
    expect(relations).to.have.members(expectedRelations);
  });
});
