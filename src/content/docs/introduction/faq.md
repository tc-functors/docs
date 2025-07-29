---
title: FAQ
description: Frequently Asked Questions
---

#### What is a Cloud Functor ?
A cloud functor is an acyclic DAG (topology) of composable cloud entities viz functions, mutations, events, routes, states, queues and channels. tc implements the Cloud Functor pattern.

:::note
The word functor was popularized by Ocaml's parameterized modules. These modules, called functors, are first class. Cloud functors are similar in that they are treated as first class and are composable much like Ocaml's elegant modules.
:::

#### Why does it have to a topology ?

In the serverless context, a lambda is a not a micro service, a topology is. A topology comprises of these core entities and their components. tc composes these and builds a graph to ascertain their dependencies, order of creation and generate flows.


#### Is tc ready to be used in production ?

While it is usable in dev and production environments, tc is still being actively developed. The specification is stable and versioned.

:::note
We look forward to a stable release (0.9.x) in late 2025.
:::

#### How does it compare to other Cloud deployers ?

tc is an application composer that implements the Cloud Functor pattern. It is not fair to compare these tools as all of them are unique and suited for different needs. `tc` may or may not be for you.


|                     | Terraform | Amplify   | Serverless | SST        | tc            |
|---------------------|-----------|-----------|------------|------------|---------------|
| Entity Abstraction  | No        | No        | Yes        | No         | Yes           |
| Composable Entities | No        | No        | No         | No         | Yes           |
| Dynamic Flows       | No        | No        | No         | No         | Yes           |
| Stateful            | Yes       | Yes       | Yes        | Yes        | No            |
| Namespacing         | No        | No        | No         | No         | Yes           |
| Sandboxing          | No        | No        | No         | Yes        | Yes           |
| Canaries            | No        | No        | No         | No         | Yes           |
| Dynamic Permissions | No        | No        | No         | No         | Yes           |
| Cloud Agnostic      | No        | No        | No         | No         | Yes           |
| Written in          | Go        | Nodejs    | Nodejs     | Typescript | Rust          |
| IAC                 | Yes       | Yes       |            |            | No            |
| Fullstack           | Maybe     | Yes       | Yes        | Yes        | Yes           |
| Function builders   | No        | No        | Limited    | Limited    | Sophisticated |
| License             | BSL       | Apache2.0 | MIT*       | MIT        | MIT           |




#### If tc generates the infrastructure boilerplate, can I modify and update it ?

For the most part,  the generated permissions, defaults are good for development and prototype. However, if you need something auditable, it can always be overlayed See https://tc-functors.org/entities/functions#permissions
