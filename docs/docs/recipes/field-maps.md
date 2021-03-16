---
title: Working With Field Maps
---

**Field Maps** are one of the most essential pieces of **GraphQL-Utils**. They are a parsed version of the GraphQL AST simplified to take fragments into account as well as remove the extra data we aren't interested in.

You can read more about the `FieldMap` interface [here](../reference/interfaces.md#fieldmap).

In order to retrieve the field map we can use the `resolveFieldMap()` helper, which takes `info` as its only required argument, and we may additionally specify whether a deep field map should be parsed, so we can check nested data and calculate the cost of a query, or just a single layer for example to help us optimize our SQL `SELECT` and `JOIN` queries.

## Resolving A Field Map

In order to resolve a field map, all we need to do is use the `info` argument passed to our GraphQL resolvers, and retrieve the field map using the `resolveFieldMap()` helper, we can pass various options to adjust the output.

Let's take a look at an example query:

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

### Deep

If we want the deep field map without any additional configuration, all we need to do is call `resolveFieldMap()` with our `info` object:

```ts
import { resolveFieldMap } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fieldMap = resolveFieldMap(info);
      console.log(fieldMap);
    },
  },
};
```

This will output the following field map:

```ts
{
  posts: {
    id: {},
    title: {},
    body: {},
    author: {
      id: {},
      username: {},
      firstName: {},
      lastName: {},
    },
  }
}
```

Now, if we want to know which columns to `SELECT` from our database, we can use a simple filter to only retrieve those fields without subselections, and then print those keys:

```ts
const fields = Object.entries(fieldMap.posts)
  .filter(([key, values]) => Object.keys(values).length)
  .map(([key, _]) => key);
console.log(fields);
```

Our output will be as follows:

```ts
["id", "title", "body"];
```

### Flat

We can also resolve a flat field map, if we only want to use it to e.g. optimize SQL queries. The flat field map will be able to tell us which columns we need to select, which can be used in combination with a query builder like KnexJS or ORMs like MikroORM to make more efficient calls to our database.

For this we simply pass `false` to the second argument of `resolveFieldMap()`:

```ts
import { resolveFieldMap } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const fieldMap = resolveFieldMap(info, false);
      console.log(fieldMap);
    },
  },
};
```

This will output the following field map:

```ts
{
  posts: {
    id: {},
    title: {},
    body: {},
    author: {},
  }
}
```

Then, we could use `Object.keys()` to get a list of all the selected fields:

```ts
const fields = Object.keys(fieldMap.posts);
console.log(fields);
```

Our output will be as follows:

```ts
["id", "title", "body", "author"];
```

Since `author` isn't per se a field we can just `SELECT` from our database, it might make more sense to use the deep field map to filter out fields with subselections as we showed above.

### Under A Specified Parent

If we only want to retrieve the field map under a specified parent, we can use dot-notation or an array of strings to specify this parent. This can be useful for queries that are computed instead of direct entrypoints to database tables, and we need to get all the fields requested for each entity.

Let's change up our query a bit:

```graphql
{
  postsOverview {
    topPosts {
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
    risingPosts {
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
}
```

Now we can specify the parent under which we want to get our field map from with either of the two syntaxes:

- `"postsOverview.topPosts"`
- `["postsOverview", "topPosts"]`

The rest of how `resolveFieldMap()` works is identical to the previous examples, we just need to make sure to specify `deep` in the arguments:

```ts
import { resolveFieldMap } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    postsOverview(_, __, ___, info) {
      const fieldMap = resolveFieldMap(info, true, "postsOverview.topPosts");
      console.log(fieldMap);
    },
  },
};
```

This will output the following field map:

```ts
{
  topPosts: {
    id: {},
    title: {},
    body: {},
    author: {
      id: {},
      username: {},
      firstName: {},
      lastName: {},
    },
  }
}
```

## Usage with KnexJS

🚧 Work in Progress!

## Usage with MikroORM

🚧 Work in Progress!
