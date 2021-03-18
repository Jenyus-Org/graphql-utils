# nestjs-graphql-utils

![License: MIT](https://img.shields.io/github/license/Jenyus-Org/graphql-utils)
[![NPM Release](https://img.shields.io/npm/v/@jenyus-org/nestjs-graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)
[![NPM Downloads](https://img.shields.io/npm/dw/@jenyus-org/nestjs-graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)
[![NPM Type Definitions](https://img.shields.io/npm/types/@jenyus-org/graphql-utils)](https://www.npmjs.com/package/@jenyus-org/nestjs-graphql-utils)

`@jenyus-org/nestjs-graphql-utils` is a collection of utilities and decorators built on top of [`@jenyus-org/graphql-utils`](../graphql-utils/) to encourage the stateless nature of NestJS GraphQL resolvers and simplify the usage of helpers.

- [nestjs-graphql-utils](#nestjs-graphql-utils)
  - [Documentation](#documentation)
  - [Installation](#installation)
  - [Getting Started](#getting-started)

## Documentation

The full documentation with live code sandboxes can be found [here](https://jenyus-org.github.io/graphql-utils/).

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

## Getting Started

Typically, you will want to use the NestJS GraphQL-Utils package and its decorators to optimize your SQL `SELECT` and `JOIN` statements. You can use the `@Selections()` decorator and [wildcards](https://jenyus-org.github.io/graphql-utils/docs/recipes/resolving-selections) to get the precise fields and relations to populate:

```ts
import { Selections } from "@jenyus-org/nestjs-graphql-utils";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UserObject } from "../users/dto/user.object";
import { UsersService } from "../users/users.service";
import { PostObject } from "./dto/post.object";
import { Post } from "./entities/post.entity";
import { PostsService } from "./posts.service";

@Resolver(() => PostObject)
class PostsResolver {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  @Query(() => [PostObject])
  posts(
    @Selections("posts", ["**.**"])
    relations: string[],
    @Selections("posts", ["*."]) fields: string[]
  ) {
    return await this.postsService.findAll({ relations, fields });
  }

  @ResolveField(() => UserObject)
  async author(@Parent() post: Post) {
    if (post.author) {
      return post.author;
    }
    return await this.usersService.findOne({ postId: post.id });
  }
}
```
