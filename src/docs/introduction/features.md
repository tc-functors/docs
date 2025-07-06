# Features

## 1. Composable Entities

At it's core, `tc` provides 7 entities (functions, events, mutations, queues, routes, states and channels) that are agnostic to any cloud provider. These entities are core primitives to define the topology of any serverless system. For example, consider the following topology definition:

```yaml

name: example

routes:
  myposts:
    path: /api/posts
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
  remote:
    foo: github.com/bar/bar
  local:
    bar: ./bar

```

Now, `/api/posts` route calls function `bar` and generates an event `MyEvent` which are handled by functions that are locally defined (subdirectories) or remote (git repos). In this example, the event finally triggers a channel notification with the event's payload. We just defined the flow without specifying anything about infrastructure, permissions or the provider. This definition is good enough to render it in the cloud as services, as architecture diagrams and release manifests.

`tc compile` maps these entities to the provider's serverless constructs. If the provider is AWS (default), tc maps `routes` to API Gateway, events to `Eventbridge`, `functions` to either `Lambda` or `ECS Fargate`, `channels` to `Appsync Events`, `mutations` to `Appsync Graphql` and `queues` to `SQS`

## 2. Namespacing

If we run `tc compile` in the directory containing the above topology (topology.yml), we see that all the entities are namespaced. This implies there is room for several `foo`,`bar` or `MyEvent` entities in another topology. This also encourages developers to name the entities succinctly similar to function names in a module. With namespacing comes the benefit of having a single version of the namespace and thereby avoiding the need to manage the versions of sub-components.

## 3. Sandboxing

You can create a sandbox of this topology in the cloud (AWS is the default provider) using

```
tc create -s <sandbox-name> -e <aws-profile>
```

and can invoke (`tc invoke -s sandbox -e env -p payload.json`) this topology. This sandbox is also versioned and we can update specific entities or components in it. Sandboxing is fundamental to canary-based routing and deploys. `tc create` also knows how to build the functions, implicitly, for various language runtimes.

```
tc update -s sandbox -e env -c events|routes|mutations|functions|flow
```

## 4. Inference

`tc compile` generates a lot of the infrastructure (permissions, default configurations etc) boilerplate needed for the configured provider. Think of infrastructure as _Types_ in a dynamic programming language. We can override the defaults or inferred configurations separate from the topology definition. For example we can have a repository layout as follows:

```
services/<topology>/<function>
infrastructure/<topology>/vars/<function>.json
infrastructure/<topology>/roles/<function>.json
```

This encourages developers to not leak infrastructure into domain-specific code or topology definition and vice versa. A topology definition could be rendered in with different infrastructure providers.


## 5. Recursive Topology

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

## 6. Isomorphic Topology

The output of `tc compile` is a self-contained, templated topology (or manifest) that can be rendered in any sandbox. The template variables are specific to the provider, sandbox and configuration. When we create (`tc create`) the sandbox with this templated topology, it implicitly resolves it by querying the provider. We can write custom resolvers to resolve these template variables by querying the configured provider (AWS, GCP etc).

```
tc compile | tc resolve -s sandbox -e env | tc create
```

We can replace the resolver with `sed` or a template renderer with values from ENV variables, SSM parameter store, Vault etc. For example:

```
tc compile | sed -i 's/{{API_GATEWAY}}/my-gateway/g' |tc create
```

The resolver can also be written in any language that is easy to use and query the provider, efficiently. The output of the compiler, the resolver and the sandbox's metadata as seen above are _isomorphic_. They are structurally the same and can be diffed like git-diff. Diffable infrastructure without having external state is a simple yet powerful feature.
