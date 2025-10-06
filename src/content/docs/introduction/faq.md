---
title: FAQ
description: Frequently Asked Questions
---

#### What is a Cloud Functor ?
A cloud functor is an acyclic DAG (topology) of composable cloud entities viz functions, mutations, events, routes, states, queues and channels. tc implements the Cloud Functor pattern.

:::note
The word functor was popularized by Ocaml's parameterized modules. These modules, called functors, are first class. Cloud functors are similar in that they are treated as first class and are composable much like Ocaml's elegant modules.
:::

#### Who is tc for ?

To start with, it is for anyone looking to have a simple way to manage serverless workflows on AWS.

#### Why does it have to be a topology or a graph ?

In the Cloud Functor world, a lambda is a not a micro service, a topology is. A topology comprises of core entities (functions, mutations, events, routes, states, queues, pages and channels) and their components. This topology is considered a single atomic unit of deployment. tc composes these and builds a graph to ascertain their dependencies, order of creation by doing a topology sort etc.


#### Why does it have to be a topology or a graph ?

tc is an application composer that implements the Cloud Functor pattern. It is not fair to compare it with other infrastructure tools as all of them are unique and suited for different needs. `tc` may or may not be for you. If you like to express your architecture and application topology at a high-level with minimal or no infrastructure code, then tc is for you!


|                     | Terraform | Amplify   | Serverless | SST        | tc            |
|---------------------|-----------|-----------|------------|------------|---------------|
| Entity Abstraction  | No        | No        | No         | No         | Yes           |
| Entity Composition  | No        | No        | No         | No         | Yes           |
| Dynamic Permissions | No        | No        | No         | No         | Yes           |
| Dynamic Flows       | No        | No        | No         | No         | Yes           |
| Stateful            | Yes       | Yes       | Yes        | Yes        | No            |
| Namespacing         | No        | No        | No         | No         | Yes           |
| Sandboxing          | No        | No        | No         | Yes        | Yes           |
| Canaries            | No        | No        | No         | No         | Yes           |
| Written in          | Go        | Nodejs    | Nodejs     | Typescript | Rust          |
| IAC                 | Yes       | Yes       |            |            | Generated     |
| Fullstack           | Maybe     | Yes       | Yes        | Yes        | Yes           |
| Cloud Agnostic      | Yes       | No        | No         | No         | Pending       |
| Function builders   | No        | No        | Limited    | Limited    | Sophisticated |
| License             | BSL       | Apache2.0 | MIT        | MIT        | GPL-v2        |
