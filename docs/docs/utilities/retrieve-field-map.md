---
title: Retrieving A Field Map Of The Query
slug: /resolve-field-map
---

**Field Maps** are one of the most essential pieces of **GraphQL-Utils**. They are a parsed version of the GraphQL AST simplified to take fragments into account as well as remove the extra data we aren't interested in.

You can read more about the `FieldMap` interface [here](../reference/field-map.md).

In order to retrieve the field map we can use the `resolveFieldMap()` helper, which takes `info` as its only required argument, and we may additionally specify whether a deep field map should be parsed, so we can check nested data and calculate the cost of a query, or just a single layer for example to help us optimize our SQL `SELECT` and `JOIN` queries.
