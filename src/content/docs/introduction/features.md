---
title: Features
description: Key Features
---

The following diagram shows the list of features in tc as a consequence of implementing the 3 core concepts - **Entity Abstraction**, **Namespacing** and **Composition**.

|                            |                                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **Sandboxing**             | - Isolated dev environments <br> - Canaries <br> - Reproducible Environments                                                             |
| **Dynamic Infrastructure** | - Generate Infra boilerplate like permissions <br> - Focus on domain-specific logic <br> - Self-contained executable manifests  |
| **Contextual Updates**     | - Update sandbox with any node in the topology <br> - Faster dev iterations |
| **Semantic Architecture Definition**                      | - Generate flow, C4 and sequence diagrams <br> - Topology definition is the architecture definition                                                                                                                             |
| **Dynamic Flows**                      | - Generates ASL via inference <br> - Infer Flow Patterns through minimal hints                                                                                                                                      |

## Sandboxing

You can create a sandbox of this topology in the cloud (AWS is the default provider) using

```
tc create -s <sandbox-name> -e <aws-profile>
```

and can invoke (`tc invoke -s sandbox -e env -p payload.json`) this topology. This sandbox is also versioned and we can update specific entities or components in it. Sandboxing is fundamental to canary-based routing and deploys. `tc create` also knows how to build the functions, implicitly, for various language runtimes.

```
tc update -s sandbox -e env -c events|routes|mutations|functions|flow
```

## Dynamic Infrastructure

`tc compose` generates a lot of the infrastructure (permissions, default configurations, graphql, ASL etc) boilerplate needed for the configured provider. Think of infrastructure as _Types_ in a dynamic programming language. We can override the defaults or inferred configurations separate from the topology definition. For example we can have a repository layout as follows:

```
services/<topology>/<function>
infrastructure/<topology>/vars/<function>.json
infrastructure/<topology>/roles/<function>.json
```

This encourages developers to not leak infrastructure into domain-specific code or topology definition and vice versa. A topology definition could be rendered in with different infrastructure providers.


## Contextual Updates

Functors can be created at any level in the code repository's heirarchy. They are like fractals where we can zoom in or out. For example, consider the following retail order management topology:

```
order/
|-- payment
|   |-- other-payment-processor
|   |   `-- handler.py
|   |-- stripe
|   |   |-- handler
|   |   `-- topology.yml
|   `-- topology.yml
`-- topology.yml
```

There are two sub-topologies in the root topology. `order`, `payment` and `stripe` are valid topologies. `tc` can create and manage sandboxes at any level preserving the integrity of the overall graph.

```
cd order
tc create -s <sandbox> -e <env> --recursive
```

This feature helps evolve the system and test individual nodes in isolation.
