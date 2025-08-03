---
title: Features
description: Key Features
---

The following diagram shows the list of features in tc as a consequence of implementing the 3 core concepts - Entity Abstraction, namespacing and Composition.


[![Features image]][Features source]

[Features image]: ../../../assets/features.png
[Features source]: ../../../assets/features.png

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

`tc compile` generates a lot of the infrastructure (permissions, default configurations etc) boilerplate needed for the configured provider. Think of infrastructure as _Types_ in a dynamic programming language. We can override the defaults or inferred configurations separate from the topology definition. For example we can have a repository layout as follows:

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
