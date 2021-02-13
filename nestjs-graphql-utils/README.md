# nestjs-graphql-utils

`@jenyus-org/nestjs-graphql-utils` is a collection of utilities and decorators built on top of [`@jenyus-org/graphql-utils`](../graphql-utils/) to encourage the stateless nature of NestJS GraphQL resolvers and simplify the usage of helpers.

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

All the utilities provided by `@jenyus-org/nestjs-graphql-utils` are exported directly by the package with Typescript definitions. All the functions and decorators are described below.

## Decorators

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

Similar to `@HasFields()`, `@Selections` acts as a layer on top of [`resolveSelections`](../graphql-utils/README.md), and additionally contains some logic to solve the most common use-case.

`fieldSelections` can be the same type of argument as accepted by `resolveSelections`, and will return an array of selectors which were found in the query.

Additionally, instead of passing the field selection array, users may pass a simple string, acting as the root object for subsequent fields. In this case the second argument, `fields` is required, and must be an array of strings to search within the parent selector.

Take the following example:

```ts
@Query(() => UserObject, { nullable: true })
async user(
  @Selections("user", ["username", "firstName"]) fieldSelections: string[]
) {
  console.log(fieldSelections);
}
```

If the query includes the selections `username` and `firstName`, unlike passing a similar argument structure directly to `resolveSelections`, `@Selections()` will generate the following array:

```ts
["user.posts", "user.profile"]
```

**Note:** Internally `@Selections` will remap the `fields` array to the fields, prepended by the parent, similar to what is shown in the README of `graphql-utils`.

To disable the behavior of remapping, and simply use the `fields` array as-is, a third argument `asParent`, which defaults to `true`, can be passed as `false`. Resulting in the following output:

```ts
["posts", "profile"]
```

This will continue to ensure that `posts` and `profile` was found within a `user` selector, but avoid remapping their selectors.
