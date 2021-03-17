---
title: Installation
slug: /nestjs
---

GraphQL-Utils also offers a NestJS 🔥 integration for all the utilities outlined in this documentation to make the code shorter and more intuitive in this framework.

The NestJS package can be installed with `npm`:

```bash
$ npm i @jenyus-org/nestjs-graphql-utils --save
```

Or `yarn`:

```bash
$ yarn add @jenyus-org/nestjs-graphql-utils
```

## Usage

The most intuitive way to use the NestJS package is with the `@Selections()` decorator. It supports the same options as [`resolveSelections()`](../recipes/resolving-selections.mdx) and also a shorthand, where the first parameter is the parent field, and the second is an array of selections:

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
