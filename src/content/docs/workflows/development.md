---
title: Development
description: Dev workflow
---

## Sandboxing

### Creating a Sandbox

The following command create a sandbox in the given AWS profile (-e|--profile)

```sh
cd <topology-dir>
tc create [--sandbox SANDBOX] [-e ENV]
```

### Incremental updates

While developing, we often need to incrementally deploy certain components without recreating the entire topology. `tc` provides an update command that updates given entity and components.
An entity is a core composable servereless resource. . A component is an attribute or instance of the entity.


We can update an entity and/or component as follows:

```
tc update -s sandbox -e env -c Entity/Component

```

#### Updating Entities


```sh
tc update -s sandbox -e env -c routes
tc update -s sandbox -e env -c events
tc update -s sandbox -e env -c functions
tc update -s sandbox -e env -c mutations
tc update -s sandbox -e env -c channels
tc update -s sandbox -e env -c schedules
tc update -s sandbox -e env -c queues
```

#### Updating specific component in an entity

Components in `function` entity:

```sh
tc update -s sandbox -e env -c functions/layers
tc update -s sandbox -e env -c functions/vars
tc update -s sandbox -e env -c functions/concurrency
tc update -s sandbox -e env -c functions/runtime
tc update -s sandbox -e env -c functions/tags
tc update -s sandbox -e env -c functions/roles
tc update -s sandnox -e env -c functions/function-name
```

Components in `mutation` entity:

```sh
tc update -s sandbox -e env -c mutations/authorizer
tc update -s sandbox -e env -c mutations/types
tc update -s sandbox -e env -c mutations/roles
tc update -s sandbox -e env -c mutations/RESOLVER_NAME
```

Components in `event` entity:

```sh
tc update -s sandbox -e env -c events/EVENT_NAME
tc update -s sandbox -e env -c events/roles
```

Components in `route` entity:

```sh
tc update -s sandbox -e env -c routes/ROUTE_NAME
tc update -s sandbox -e env -c routes/ROUTE_NAME/authorizer
tc update -s sandbox -e env -c routes/roles
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

:::note
It is not recommended to delete entities or components as it impacts the integrity of the sandbox.
:::


## Invoking

#### Specifying Payload

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

### Invoking Events and Lambdas

By default, `tc` invokes a stepfn. We can also invoke a lambda or trigger an Eventbridge event

```
tc invoke --kind lambda -e dev --payload '{"data"...}'
tc invoke --kind event -e dev --payload '{"data"...}'
```
