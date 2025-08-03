---
title: Concepts
description: Tc concepts
---

tc has 3 core concepts: Entity Abstraction, Namespacing and Composition.

**Entity Abstraction**

tc provides 8 cloud primitives or _entities_. These can be thought of like atoms or methods in a class. Entities can be defined in a cloud-agnostic way and tc has a specification for that.


**Namespacing**

The above entities can be namespaced arbitrarily - typically domain-specific. Namespaces can be thought of modules in a programming language or molecules comprising of atoms.


**Composition**

tc provides a simple mechanism to define and connect these namespaced entities as a graph and thus the use of word topology. As a result of entity composition, tc can infer the infrastrucuture permissions etc and render it in arbitrary sandboxes thus enabling sophisticated workflows.

## Entity Abstraction


[![Entity image]][Entity source]

[Entity image]: ../../../assets/entities.png
[Entity source]: ../../../assets/entities.png

## Namespacing

Consider the following directory structure:

```


```


## Composition

Consider the following topology definition:

```yaml

name: example

routes:
  /api/posts:
    method: GET
    function: bar
    event: MyEvent

events:
  MyEvent:
    function: foo
    channel: room1

channels:
  room1:
    function: default

functions:
  foo:
    uri: github.com/bar/bar
  bar:
    uri: ../bar

```

Now, `/api/posts` route calls function `bar` and generates an event `MyEvent` which are handled by functions that are locally defined (subdirectories) or remote (git repos). In this example, the event finally triggers a channel notification with the event's payload. We just defined the flow without specifying anything about infrastructure, permissions or the provider. This definition is good enough to render it in the cloud as services, as architecture diagrams and release manifests.

`tc compose` maps these entities to the provider's serverless constructs. If the provider is AWS (default), tc maps `routes` to API Gateway, events to `Eventbridge`, `functions` to either `Lambda` or `ECS Fargate`, `channels` to `Appsync Events`, `mutations` to `Appsync Graphql` and `queues` to `SQS`


## Entity Composition Matrix

The following shows the composability Matrix.


|          | Function | Event | Queue | Route | Channel | Mutation | Page |
|----------|----------|-------|-------|-------|---------|----------|------|
| Function |          |       |       |       |         |          |      |
| Event    | Yes      |       |       |       | Yes     | Yes      |      |
| Route    | Yes      |       |       |       |         |          |      |
| Queue    | Yes      |       |       |       |         |          |      |
| Channel  | Yes      |       |       |       |         |          |      |
| Mutation | Yes      | Yes   |       |       |         |          |      |
| Page     |          |       |       |       |         |          |      |


:::note
Not all entities are composable with each other currently as seen in the above matrix. We expect to have 100% composition working on AWS serverless soon. Other providers to follow.
:::
