---
title: Checking For Fields To Do Conditional JOINs
---

As we showed in the getting started section of this documentation, the `hasFields()` utility allows us to check if fields under a given path were requested in the query.

The path we specify may be in dot notation or as an array of fields, and we can specify if the field should be at the root level or we want to search at any depth, which will have it do a greedy search for the fields.

Here, using dot notation:

```ts
import { hasFields } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const requestedAuthor = hasFields(info, "posts.author");
      console.log(requestedAuthor);
    },
  },
};
```

Given the following query, this will output `true` to the console:

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

## Array Notation

As mentioned above, we may also use arrays to specify the fields we're looking for:

```ts
import { hasFields } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const requestedAuthor = hasFields(info, ["posts", "author"]);
      console.log(requestedAuthor);
    },
  },
};
```

## Greedy

If we simply want to check, whether `author` was requested at all, we can also use the greedy search by setting the last argument to `false`:

```ts
import { hasFields } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    posts(_, __, ___, info) {
      const requestedAuthor = hasFields(info, "author", false);
      console.log(requestedAuthor);
    },
  },
};
```

## Usage with KnexJS

By checking if the `author` is being queried in advance, we can do conditional `JOIN`s using KnexJS and avoid further SQL queries:

```ts
import { hasFields } from "@jenyus-org/graphql-utils";

const resolvers = {
  Query: {
    async posts(_, { db }, ___, info) {
      let query = db.select("*").from("posts");

      const requestedAuthor = hasFields(info, "posts.author");

      if (requestedAuthor) {
        // add an additional LEFT JOIN
        query = query.leftJoin("users", "posts.author_id", "users.id");
      }

      let users = await query;
      if (requestedAuthor) {
        // remap posts with nested author
        posts = posts.map((post) => ({
          ...post,
          author: {
            username: usersUsername,
            // ...other fields
          },
        }));
      }
      return users;
    },
  },
  Post: {
    async author(post, { db }) {
      if (post.author) {
        // author was already fetched in query with KnexJS
        return post.author;
      }

      // we still need to fetch the author from the DB
      return await db.select("*").from("users").where("id", post.author_id);
    },
  },
};
```

## Usage with MikroORM

🚧 Work in Progress!
