# nestjs-graphql-utils

![License: MIT](https://img.shields.io/github/license/Jenyus-Org/graphql-utils)
[![NPM Release](https://img.shields.io/npm/v/@jenyus-org/nestjs-graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)
[![NPM Downloads](https://img.shields.io/npm/dw/@jenyus-org/nestjs-graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)
[![NPM Type Definitions](https://img.shields.io/npm/types/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)

`@jenyus-org/nestjs-graphql-utils` is a collection of utilities and decorators built on top of [`@jenyus-org/graphql-utils`](../graphql-utils/) to encourage the stateless nature of NestJS GraphQL resolvers and simplify the usage of helpers.

- [nestjs-graphql-utils](#nestjs-graphql-utils)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Decorators](#decorators)
    - [`@FieldMap(deep: boolean = true, parent: string | string[] = []): FieldMap`](#fieldmapdeep-boolean--true-parent-string--string---fieldmap)
    - [`@FieldNodeAt(path: string | string[]): FieldNode | undefined`](#fieldnodeatpath-string--string-fieldnode--undefined)
    - [`@Fields(deep: boolean = true, parent: string | string[] = []): string[]`](#fieldsdeep-boolean--true-parent-string--string---string)
    - [`@HasFields(...fields: (string | string[])[]): boolean`](#hasfieldsfields-string--string-boolean)
    - [`@Selections(fieldSelections: string | string[] | FieldSelections[], fields?: string[], asParent: boolean = true): string[]`](#selectionsfieldselections-string--string--fieldselections-fields-string-asparent-boolean--true-string)

## Installation

`@jenyus-org/nestjs-graphql-utils` can be installed from NPM by running one of the following commands:

NPM:

```bash
npm i --save @jenyus-org/nestjs-graphql-utils
```

Yarn:

```bash
yarn add @jenyus-org/nestjs-graphql-utils
```

This will install `@jenyus-org/nestjs-graphql-utils` and all its dependencies.

## Usage

All the utilities provided by `@jenyus-org/nestjs-graphql-utils` are exported directly by the package with Typescript definitions, and are described below.

## Decorators

### `@FieldMap(deep: boolean = true, parent: string | string[] = []): FieldMap`

**New in v1.4.0**

This decorator wraps the `resolveFieldMap` utility from `graphql-utils` including the direct passing of arguments fed to the decorator. It returns a raw `FieldMap` instance which takes on the form of nested objects, where the keys represent the selected fields from the `GraphQLResolveInfo`. Keys with no sub-selections are assigned an empty object as their value.

**Example usage in a GraphQL resolver:**

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @FieldMap() fieldMap: FieldMap,
) {
  console.log(fieldMap);
}
```

Given the following query:

```gql
{
  user {
    username
  }
}
```

The returned `FieldMap` will be:

```ts
{
  user: {
    username: {},
  }
}
```

### `@FieldNodeAt(path: string | string[]): FieldNode | undefined`

**New in v1.5.0**

`@FieldNodeAt` wraps the `getFieldNode()` utility from `graphql-utils`, which takes a path and then tries to find a field node at the specified location in the `GraphQLResolveInfo`. If none was found, `undefined` is returned instead.

### `@Fields(deep: boolean = true, parent: string | string[] = []): string[]`

**New in v1.4.0**

`@Fields` is a wrapper over the `resolveFields` utility from `graphql-utils`, which itself is a light wrapper of the `resolveFieldMaps` utility that remaps the `FieldMap` return by the function with `fieldMapToDot`.

Instead of returning a `FieldMap` result, it returns a `string[]` which are a list of all the requested fields in dot notation.

**Example usage in a GraphQL resolver:**

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @Fields() fields: string[],
) {
  console.log(fields);
}
```

Using the same query as above, the output would be the following:

```ts
["user", "user.username"];
```

### `@HasFields(...fields: (string | string[])[]): boolean`

`@HasFields()` uses the received `GraphQLResolveInfo` from the incoming request, to run [`hasFields`](../graphql-utils/../README.md) for every argument passed. Just like `hasFields` it supports array syntax and dot notation, and uses AND bitwise operations ensuring that every field passed resolves to `true`.

**Example usage in a GraphQL resolver:**

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @HasFields("user.username") wantsUsername: boolean,
) {
  console.log(wantsUsername);
}
```

Given the following query, `true` will be printed to the console:

```gql
{
  user {
    username
  }
}
```

### `@Selections(fieldSelections: string | string[] | FieldSelections[], fields?: string[], asParent: boolean = true): string[]`

**Updated in v1.6.0**

Similar to `@HasFields()`, `@Selections` acts as a layer on top of [`resolveSelections`](../graphql-utils/README.md), and additionally contains some logic to solve the most common use-case.

`fieldSelections` can be the same type of argument as accepted by `resolveSelections`, and will return an array of selectors which were found in the query.

Additionally, instead of passing the field selection array, users may pass a simple string, acting as the root object for subsequent fields. In this case the second argument, `fields` is required, and must be an array of strings to search within the parent selector.

Take the following example:

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @Selections("user", ["posts", "profile"]) fieldSelections: string[]
) {
  console.log(fieldSelections);
}
```

If the query includes the selections `posts` and `profile`, `@Selections()` will generate the following array:

```ts
["posts", "profile"];
```

A final argument that may be specified, `withParent`, allows `@Selections()` to automatically remap the fields specified in the second argument and prepend them with the parent. This can be useful to do more fine-grained checks, especially when searching for subselection of relationships like so:

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @Selections("posts", ["comments"], true) postsSelections: string[]
) {
  console.log(postsSelections);
}
```

This will generate the following output, if the selection `user.posts.comments` is made in the query:

```ts
["posts.comments"];
```
