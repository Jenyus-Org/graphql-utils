# graphql-utils

`@jenyus-org/graphql-utils` is a collection of utilities to aid in working with GraphQL projects that have the [`graphql`](https://github.com/graphql/graphql-js) library as a base.

## Installation

As laid out in the main project repo, in order to install these packages the GitHub Package registry must be added to an `.npmrc` or `.yarnrc` file. View further details [here](../README.md).

After the configuration file hs been setup, it's as simple as running one of the following commands:

NPM:

```bash
npm i --save @jenyus-org/graphql-utils
```

Yarn:

```bash
yarn add @jenyus-org/graphql-utils
```

This will install `@jenyus-org/graphql-utils` and all its dependencies.

## Usage

All the utilities provided by `@jenyus-org/graphql-utils` are exported directly by the package with Typescript definitions. All the functions and helpers are described below.

## Utilities

### `hasFields(search: string | string[], info: GraphQLResolveInfo): boolean`

Provided the `GraphQLResolveInfo` from a given query, `hasFields` will recursively scan through the field selections, including GraphQL fragments for a subselection of fields given to `search`. It supports dot notation as well as an array structure for the search.

Given the following query:

```gql
{
  user {
    username
    posts {
      title
      body
      createdAt
    }
  }
}
```

`hasFields` can be used to check whether the query includes a subselection of fields. If you wanted to check whether posts were requested, it's as simple as running the following:

```ts
const requestedPosts = hasFields("user.posts", info);  // GraphQLResolveInfo provided by resolver function args
```

Alternatively, an array of fields may be used for better readability:

```ts
const requestedPosts = hasFields(["user", "posts"], info);  // GraphQLResolveInfo provided by resolver function args
```

### `resolveSelections(fields: (string | FieldSelections)[], info: GraphQLResolveInfo): string[]`

`resolveSelections` is an extension of `hasFields`, designed to aid in generating the most efficient SQL queries possible when using an ORM like [TypeORM](https://typeorm.io/).

`resolveSelections` takes as its first argument, a deeply nested list of fields to recursively search through, and add to its final return array of selections made in the actual query. For more details on the structure of `FieldSelections`, see the section below. Just like `hasFields` it also expects to be passed the `GraphQLResolveInfo` from the query made.

Using a slightly extended version of the example query above:

```gql
{
  user {
    username
    posts {
      title
      body
      createdAt
    }
    profile {
      img
      description
      slug
    }
  }
}
```

`resolveSelections` can be used in this example to retrieve all the relations that were actually requested in the query, which can then be passed on to the query builder, or ORM like so:

```ts
const fields: FieldSelection[] = [
  {
    field: "user",
    selections: [
      {
        field: "posts",
        selector: "user.posts",
      },
      {
        field: "profile",
        selector: "user.profile",
      }
    ],
  }
]

const relations = resolveSelections(fields, info);  // GraphQLResolveInfo provided by resolver function args
```

The output will be the following:

```ts
["user.posts", "user.profile"]
```

As `fields` can be represented by both objects and strings, they will be handled differently depending on their type. Using the object syntax `resolveSelections` will ensure the existence of the field, and if a `selector` value is present, it will be added to the accumulation of selections.

If instead, a string array is passed to `fields` or `selections`, the query will be tested for the field and the results will be accumulated as such.

**Note:** Whenever fields are being tested in the query, the fields higher above are prepended to the check. This means the `posts` selection will only resolve if `user.posts` is found, and not simply `posts`.

#### `interface FieldSelections`

```ts
interface FieldSelections {
  field: string;
  selector?: string;
  selections?: (string | FieldSelections)[];
}
```

#### Motivation behind `resolveSelections`

ORMs like the aforementioned TypeORM can make use of dot notation arguments to automatically `JOIN` certain entities. While it would be possible to use `hasFields` to check if the `posts` have been requested, and then add `user.posts` to the list of relations to be resolved, `resolveSelections` provides a much more convenient and readable interface to achieve the same thing.
