---
title: Composition
description: Composition
---

`Composition` is fundamental to tc. Here are some examples:

Compose an event and function:

```
name: example-composition

events:
  MyEvent:
    function: foo
```

To compose a linear DAG of functions:

```
functions:
  foo:
    function: bar
  bar:
	function: baz
```

To compose a route and a function:

```
routes:
  /api/ping:
    function: foo
```
To compose a function and a mutation:


```
name: example-orchestrator

events:
  MyEvent:
    function: foo

functions:
  foo:
    function: bar
    mutation: processMessage

mutations:
  authorizer: authorizer
  types:
    Message:
      id: String!
      text: String
  resolvers:
    processMessage:
      function: tester
      input: Message
      output: Message
      subscribe: true
```

## Entity Composition Matrix

The following shows the composability Matrix for entities


|          | Function | Event | Queue | Route | Channel | Mutation | Page |
|----------|----------|-------|-------|-------|---------|----------|------|
| Function | Yes      | Yes   |       |       |         | Yes      |      |
| Event    | Yes      |       |       |       | Yes     | Yes      |      |
| Route    | Yes      |       |       |       |         | Yes      |      |
| Queue    | Yes      |       |       |       |         |          |      |
| Channel  | Yes      |       |       |       |         |          |      |
| Mutation | Yes      | Yes   |       |       |         |          |      |
| Page     |          |       |       | Yes   |         |          |      |
