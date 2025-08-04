---
title: Development
description: Dev workflow
---

[![Dev image]][Dev source]

[Dev image]: ../../../assets/dev.png
[Dev source]: ../../../assets/dev.png

### Defining Topology

- Define your events, routes, channels, queues, pages in topology.yml
```yaml
routes:
  /api/foo:
    method: POST

events:
  MyEvent:
    producer: default

pages:
  myapp:
    dir: webapp
```

- Specify how they are connected. For example

```yaml
routes:
  /api/foo:
    method: POST
    authorizer: my-authorizer
    function: foo

events:
  MyEvent:
    producer: default
    function: bar

pages:
  myapp:
    dir: webapp
```

- Additional scaffold the functions if they don't exist

```sh
tc scaffold --entity function
```

### Composing

We can now validate the entity definitions and their connections by running `tc compose`.
`tc compose` will generate a giant JSON that represents the target infrastructure (AWS Serverless by default).
You can see the generated permissions, target rules, mapping templates etc.

We can also have a tree view

```sh
tc compose -c functions -f tree
tc compose -s functions -f table
tc compose -c routes -f json
tc compose -c events -f json
tc compose -c states -f yaml
tc compose -c mutations -f graphql
```


### Building and testing

Most often, tc infers the kind of function, it's runtime and how to build it. However, we can override the kind of build, for example `Image` or `Inline`. See [Building Function Dependencies](/entities/functions#dependencies)

```sh
tc build
```

To build container images:

```
tc build --image base --publish
tc build --image code --publish
```

### Sandboxing


The following command create a sandbox in the given AWS profile (-e|--profile)

```sh
cd <topology-dir>
tc create [--sandbox SANDBOX] [-e PROFILE]
```

While developing, we often need to incrementally deploy certain components without recreating the entire topology. `tc` provides an update command that updates given entity and components.
An entity is a core composable servereless resource. . A component is an attribute or instance of the entity.


We can update an entity and/or component as follows:

```sh
tc update -s SANDBOX -e PROFILE -c Entity/Component

```

```sh
tc update -s SANDBOX -e PROFILE -c routes
tc update -s SANDBOX -e PROFILE -c events
tc update -s SANDBOX -e PROFILE -c functions
tc update -s SANDBOX -e PROFILE -c mutations
tc update -s SANDBOX -e PROFILE -c channels
tc update -s SANDBOX -e PROFILE -c schedules
tc update -s SANDBOX -e PROFILE -c queues
```

To update specific component in an entity:

Components in `function` entity:

```sh
tc update -s SANDBOX -e PROFILE -c functions/layers
tc update -s SANDBOX -e PROFILE -c functions/vars
tc update -s SANDBOX -e PROFILE -c functions/concurrency
tc update -s SANDBOX -e PROFILE -c functions/runtime
tc update -s SANDBOX -e PROFILE -c functions/tags
tc update -s SANDBOX -e PROFILE -c functions/roles
tc update -s sandnox -e PROFILE -c functions/function-name
```

Components in `mutation` entity:

```sh
tc update -s SANDBOX -e PROFILE -c mutations/authorizer
tc update -s SANDBOX -e PROFILE -c mutations/types
tc update -s SANDBOX -e PROFILE -c mutations/roles
tc update -s SANDBOX -e PROFILE -c mutations/RESOLVER_NAME
```

Components in `event` entity:

```sh
tc update -s SANDBOX -e PROFILE -c events/EVENT_NAME
tc update -s SANDBOX -e PROFILE -c events/roles
```

Components in `route` entity:

```sh
tc update -s SANDBOX -e PROFILE -c routes/ROUTE_NAME
tc update -s SANDBOX -e PROFILE -c routes/ROUTE_NAME/authorizer
tc update -s SANDBOX -e PROFILE -c routes/roles
```

### Invoking


To simply invoke a functor

```
tc invoke --sandbox main --env dev
```
By default, tc picks up a `payload.json` file in the current directory. You could optionally specify a payload file

```
tc invoke --sandbox main --env dev --payload payload.json
```

or via stdin
```
cat payload.json | tc invoke --sandbox main --env dev
```

or as a param
```
tc invoke --sandbox main --env dev --payload '{"data": "foo"}'
```

By default, `tc` invokes a stepfn. We can also invoke a lambda or trigger an Eventbridge event

```
tc invoke --kind lambda -e dev --payload '{"data"...}'
tc invoke --kind event -e dev --payload '{"data"...}'
```


### Deleting Sandbox

To delete a sandbox:

```sh

tc delete -s sandbox -e env
```

To delete a specific entity/component. See update commands (above) for list of components

```
tc delete -s sandbox -e env -c ENTITY/COMPONENT
```

:::caution
It is not recommended to delete entities or components as it impacts the integrity of the sandbox.
:::
