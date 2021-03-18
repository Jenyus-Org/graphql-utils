# graphql-utils
![License: MIT](https://img.shields.io/github/license/Jenyus-Org/graphql-utils)
[![NPM Release](https://img.shields.io/npm/v/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)
[![NPM Downloads](https://img.shields.io/npm/dw/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)
[![NPM Type Definitions](https://img.shields.io/npm/types/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)

`@jenyus-org/graphql-utils` is a collection of utilities to aid in working with GraphQL projects that have the [`graphql`](https://github.com/graphql/graphql-js) library as a base.

- [graphql-utils](#graphql-utils)
  - [Documentation](#documentation)
  - [Installation](#installation)
  - [Getting Started](#getting-started)

## Documentation

The full documentation with live code sandboxes can be found [here](https://jenyus-org.github.io/graphql-utils/).

## Installation

`@jenyus-org/graphql-utils` can be installed from NPM by running one of the following commands:

NPM:

```bash
npm i --save @jenyus-org/graphql-utils
```

Yarn:

```bash
yarn add @jenyus-org/graphql-utils
```

This will install `@jenyus-org/graphql-utils` and all its dependencies.

## Getting Started

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

This will output `true` for the following query:

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
