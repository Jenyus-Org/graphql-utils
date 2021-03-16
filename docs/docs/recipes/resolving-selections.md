---
title: Resolving Selections For Use With ORMs
---

In addition to parsing field maps and checking if a field selection was made, GraphQL-Utils also offers a very powerful utility to directly retrieve an array of fields that were selected, to make working with popular ORMs much easier.

We can use the `resolveSelections` utility to have it check, if certain fields were requested in the query, and return those to us in array form, like so:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["author"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

Given the following query:

```graphql
{
  posts {
    id
    title
    body
    author {
      id
      username
      firstName
      lastName
    }
  }
}
```

Our above code will log the following:

```json
["author"]
```

Important to understand with `resolveSelections()` is it will only return fields with the `selector` property, or `selections` passed as strings. So it won't return `posts`, and will simply make sure it's the parent of subselections.

If you want to have `posts` returned as well, you may specify its `selector` property like so:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selector: "posts",
          selections: ["author"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
["posts", "author"]
```

## Wildcards

`resolveSelections()` also supports wildcards, to select fields under a given parent dynamically. This lets GraphQL-Utils handle all the logic to e.g. only retrieve fields with or without subselections, as well as handle deeper trees.

### `*`

The `*` wildcard is very simple, it will select all the fields under a given parent:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["*"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
["id", "title", "body", "author"]
```

### `*.*`

`*.*` works similar to `*`, but goes to unlimited depths:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["*.*"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
[
  "id",
  "title",
  "body",
  "author",
  "author.id",
  "author.username",
  "author.firstName",
  "author.lastName"
]
```

:::tip

The `*.*` wildcard can be useful to calculate the cost of a given query.

:::

### `**`

`**` just like `*` only works one-level deep, but only looks for fields with subselections:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["**"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
["author"]
```

:::tip

The `**` wildcard can be useful in combination with ORMs like MikroORM and TypeORM which offer ways to define relations that should be `JOIN`ed as part of the initial `SELECT` query.

:::

### `**.**`

`**.**` follows the same patterns as we've been seeing so far, `**` filters fields with subselections, and by adding `.**`, goes to unlimited depths:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["**.**"],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
["author"]
```

:::tip

The `**.**` wildcard can be useful in combination with ORMs like MikroORM and TypeORM which offer ways to define relations that should be `JOIN`ed as part of the initial `SELECT` query.

:::

### `*.`

`*.` is the equivalent of `**`, but for fields without subselections.:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fields: FieldSelections[] = [
        {
          field: "posts",
          selections: ["*."],
        },
      ];

      const selections = resolveSelections(fields, info);

      console.log(selections);
    },
  },
};
```

This will log the following:

```json
["id", "title", "body"]
```

:::tip

The `*.` wildcard can be useful to get the columns we need to `SELECT` from our database.

:::

## Usage with MikroORM

ORMs like MikroORM and TypeORM offer powerful features to define the database columns and relationships that should be requested. This allows them to generate very efficient queries and limit the number of trips we make to our database.

In combination with the `resolveSelections()` utility, and wildcards outlined above, we can limit our queries to only the data we need, and MikroORM even supports [Smart Nested Populate](https://mikro-orm.io/docs/nested-populate) which allows relationships to be loaded at deeper levels allowing us to use the `**.**` wildcard:

```ts
import { resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, { postsRepository }, ___, info) {
      const fieldSelections: FieldSelections[] = [
        {
          field: "posts",
          selections: ["*."],
        },
      ];

      const fields = resolveSelections(fieldSelections, info);

      const relationSelections: FieldSelections[] = [
        {
          field: "posts",
          selections: ["**.**"],
        },
      ];

      const relations = resolveSelections(relationSelections, info);

      return postsRepository.find({}, { populate: relations, fields });
    },
  },
};
```

:::info

You can read more about the MikrORM `EntityManager`/`EntityRepository` `populate` and `fields` options in their [docs](https://mikro-orm.io/docs/entity-manager-api).

:::
