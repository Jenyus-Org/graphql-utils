# graphql-utils
![License: MIT](https://img.shields.io/github/license/Jenyus-Org/graphql-utils)
[![NPM Release](https://img.shields.io/npm/v/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)
[![NPM Downloads](https://img.shields.io/npm/dw/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)
[![NPM Type Definitions](https://img.shields.io/npm/types/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/graphql-utils)

`@jenyus-org/graphql-utils` is a collection of utilities to aid in working with GraphQL projects that have the [`graphql`](https://github.com/graphql/graphql-js) library as a base.

- [graphql-utils](#graphql-utils)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Interfaces](#interfaces)
    - [`FieldMap`](#fieldmap)
    - [`FieldSelections`](#fieldselections)
  - [Utilities](#utilities)
    - [`fieldMapToDot (fieldMap: FieldMap): string[]`](#fieldmaptodot-fieldmap-fieldmap-string)
    - [`getFieldMap (fieldMap: FieldMap, parent: string | string[]): FieldMap`](#getfieldmap-fieldmap-fieldmap-parent-string--string-fieldmap)
    - [`getFieldNode (info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, path: string | string[] = []): FieldNode | undefined`](#getfieldnode-info-pickgraphqlresolveinfo-fieldnodes--fragments-path-string--string---fieldnode--undefined)
    - [`hasFields(info: GraphQLResolveInfo, search: string | string[], atRoot: boolean = false): boolean`](#hasfieldsinfo-graphqlresolveinfo-search-string--string-atroot-boolean--false-boolean)
    - [`resolveFieldMap(info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, deep: boolean = true, parent: string | string[] = ""): FieldMap`](#resolvefieldmapinfo-pickgraphqlresolveinfo-fieldnodes--fragments-deep-boolean--true-parent-string--string---fieldmap)
    - [`resolveFields(info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, deep: boolean = true, parent: string | string[] = ""): string[]`](#resolvefieldsinfo-pickgraphqlresolveinfo-fieldnodes--fragments-deep-boolean--true-parent-string--string---string)
    - [`resolveSelections(fields: (string | FieldSelections)[], info: GraphQLResolveInfo): string[]`](#resolveselectionsfields-string--fieldselections-info-graphqlresolveinfo-string)
      - [Motivation behind `resolveSelections`](#motivation-behind-resolveselections)

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

## Usage

All the utilities provided by `@jenyus-org/graphql-utils` are exported directly by the package with Typescript definitions. All the functions and helpers are described below.

## Interfaces

### `FieldMap`

```ts
interface FieldMap {
  [key: string]: FieldMap;
}
```

### `FieldSelections`

```ts
interface FieldSelections {
  field: string;
  selector?: string;
  selections?: (string | FieldSelections)[];
}
```

## Utilities

### `fieldMapToDot (fieldMap: FieldMap): string[]`

**New in v1.2.0**

Given a `FieldMap`, this utility will return the dot notations of the field selections.

**Example:**

```ts
const fieldMap: FieldMap = {
  user: {
    tasks: {},
    activities: {
      task: {},
    },
  },
};

const dot = fieldMapToDot(fieldMap);
console.log(dot);
```

**Output:**

```ts
[
  "user",
  "user.tasks",
  "user.activities",
  "user.activities.task",
]
```

### `getFieldMap (fieldMap: FieldMap, parent: string | string[]): FieldMap`

**New in v1.1.0**

Given a `FieldMap` and the `parent` argument, this function will return a sub-selection of the field map. This is useful for optimization purposes if a `FieldMap` from the `GraphQLResolveInfo` is already available to retrieve selections and subselections using this helper.

### `getFieldNode (info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, path: string | string[] = []): FieldNode | undefined`

**New in v1.3.0**

Given the `GraphQLResolveInfo`, `getFieldNode` will retrieve the `FieldNode` at a specified path. The path may be specified with dot notation or as an array of fields. If no `FieldNode` was found, `undefined` will be returned.

**Note:** This function returns a raw `FieldNode` and doesn't do any remapping of fields or fragments. It's meant for internal use or more advanced users looking to hook into the GraphQL system directly.

### `hasFields(info: GraphQLResolveInfo, search: string | string[], atRoot: boolean = false): boolean`

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

The `atRoot` parameter allows users to specify whether the utility should only check for fields at the root level, or also go deeper down the tree in order to find the fields. It is recommended to have this enabled in general, but may be useful to disable at times.

### `resolveFieldMap(info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, deep: boolean = true, parent: string | string[] = ""): FieldMap`

**New in v1.1.0**

Given the `GraphQLResolveInfo`, this helper will return a `FieldMap` with all the nested selectors of the query.

The `deep` argument allows to be specified whether it should only search through a single layer of field selections, or go further down the tree. It is evaluated after the `parent` has been found, meaning that this allows you to make targeted searches for e.g. `user.posts` field selections or the sorts.

### `resolveFields(info: Pick<GraphQLResolveInfo, "fieldNodes" | "fragments">, deep: boolean = true, parent: string | string[] = ""): string[]`

**New in v1.1.0**

Similar to `resolveFieldMap`, `resolveFields` will return either flat or deep field selections made in the query, under the specified `parent` which may be passed as a dot-notated string or array of fields. The return value will be the dot-notated field selections which are returned by the `fieldMapToDot` helper.

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

#### Motivation behind `resolveSelections`

ORMs like the aforementioned TypeORM can make use of dot notation arguments to automatically `JOIN` certain entities. While it would be possible to use `hasFields` to check if the `posts` have been requested, and then add `user.posts` to the list of relations to be resolved, `resolveSelections` provides a much more convenient and readable interface to achieve the same thing.
