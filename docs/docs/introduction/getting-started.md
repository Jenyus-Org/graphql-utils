---
title: Getting Started
slug: /getting-started
---

GraphQL-Utils is a lightweight library built to work with the GraphQL AST to supercharge your GraphQL APIs. Unlike other offerings out there, we don't just parse the AST to an object map, or array of strings, but offer utilities to make working with the AST even easier than ever before.

## Installation

GraphQL-Utils can be installed with `npm`:

```bash
$ npm i @jenyus-org/graphql-utils --save
```

Or `yarn`:

```bash
$ yarn add @jenyus-org/graphql-utils
```

## Usage

One of the most straightforward and common use-cases of GraphQL-Utils is checking if a query contains a certain path. We can do this using the `hasFields()` utility:

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

Using this technique, we can, for example, conditionally `JOIN` our post authors only when requested using a query builder like KnexJS or ORMs such as MikroORM.

## Typescript Support

GraphQL-Utils is built with Typescript and exports declaration files so you will get stellar type-hinting including some types built into GraphQL-Utils.
