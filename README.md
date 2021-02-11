# graphql-utils
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`graphql-utils` is a set of NPM packages which can be useful when designing high-performance GraphQL APIs in Javascript or Typescript.

It currently consists of two packages:

 - [`graphql-utils`](./graphql-utils/README.md): GraphQL utility functions compatible with any implementation of GraphQL that uses the [`graphql`](https://github.com/graphql/graphql-js) library as a base.
 - [`nestjs-graphql-utils`](./nestjs-graphql-utils/README.md): Utilities wrapped in NestJS `ParamDecorator` to encourage the stateless nature of NestJS GraphQL resolvers.

## Installation

The packages can be installed via the `npm` and Yarn package managers. As they are stored on the GitHub Package Registry, and not NPM, a `.npmrc` configuration file or `.yarnrc` respectively must be provided:

`.npmrc`

```rc
registry=https://registry.npmjs.org
@jenyus-org:registry=https://npm.pkg.github.com
```

`.yarnrc`

```rc
registry "https://registry.npmjs.org"
"@jenyus-org:registry" "https://npm.pkg.github.com"
```

Once the configuration file has been set up, it's as easy as running `npm i @jenyus-org/<package-name>` or `yarn add @jenyus-org/<package-name>`.

For more information see the individual package folders and their respective `README`s.

## Roadmap

 - [ ] More utilities.

## License

This project is licensed under the terms of the MIT license.
