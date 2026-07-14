---
title: Mutations
description: Mutations Entity Reference
---


Read [Progress Tracker Example](/examples/progress-tracker/) for concepts and design.

## Spec

```yaml
name: {TOPOLOGY_NAME}

mutations:
  authorizer: authorizer-fn
  inputs:
    {NAME}: {TYPE_MAPPING}
  types:
    {NAME}: {TYPE_MAPPING}
  resolvers:
    {NAME}:
      function: {FUNCTION_NAME}
      input: {INPUT_OR_TYPE}
      output: {TYPE}
      subscribe: bool

```

## Types

It is straightforward to define the types as a simple key-value map. For example:

```yaml
name: mutations-basic

mutations:
  authorizer: authorizer-fn
  types:
    Input:
      id: String!
    Status:
      id: String!
      message: String

  resolvers:
    updateStatus:
      function: updater
      input: Input
      output: Status
      subscribe: true
```

Note that we did not annotate any directives as tc infers the directives based on the resolver definition. This keeps the type definitions clean and succinct.

### Inputs

_Inputs_ are special kind of _Types_ that can be referenced in other Types or Inputs. For example, in the following example, we see that Message input is referenced by ChannelInput.

```yaml
mutations:
  inputs:
    Message:
      id: String!
      text: String!
    ChannelInput:
      messages: '[Message!]!'

  types:
    Mess:
      id: String!
      text: String!

  resolvers:
    getMessage:
      function: foo
      input: ChannelInput
      output: AWSJSON
      subscribe: false
```

(Refer AWS Post)[https://docs.aws.amazon.com/appsync/latest/devguide/graphql-types.html#input-components]

### Implict Types

`tc` provides a set of convenient implicit Types. These Types capture the shape or path access in input entity's payload.


|                | Input Path        | Input Entity | Target Type |
|----------------|-------------------|--------------|-------------|
| Event          | $.detail          | Event        | String      |
| EventData      | $.detail.data     | Event        | String      |
| EventDataJSON* | $.detail.data     | Event        | AWSJSON     |
| EventMetadata  | $.detail.metadata | Event        | String      |

:::note
`EventDataJSON` is currently not functional.
:::


## Providers

`mutations` can be rendered on any Graphql server that provides subscriptions and resolvers. AWS Appsync is the default provider.

### Appsync Graphql

tc generates `graphql` for the given mutation spec and provider.

```json
{
  "default": {
    "api_name": "mutations-basic_{{sandbox}}",
    "authorizer": "authorizer-fn",
    "resolvers": {
      "updateStatus": {
        "entity": "Function",
        "input": "Input",
        "name": "updateStatus",
        "output": "Status",
        "target_arn": "arn:aws:lambda:{{region}}:{{account}}:function:{{namespace}}_updater_{{sandbox}}"
      }
    },
    "role_arn": "arn:aws:iam::{{account}}:role/tc-base-appsync-role",
    "types": {
      "Event": "type Event @aws_lambda @aws_iam { detail: String createdAt: AWSDateTime  updatedAt: AWSDateTime }",
      "Input": "type Input @aws_lambda @aws_iam {  id: String!   createdAt: AWSDateTime  updatedAt: AWSDateTime}",
      "Mutation": "type Mutation { updateStatus(id: String! ): Status@aws_lambda @aws_iam }",
      "Query": "type Query { getInput(id: String!): InputgetEvent(id: String!): EventgetStatus(id: String!): Status }",
      "Status": "type Status @aws_lambda @aws_iam {  id: String! message: String   createdAt: AWSDateTime  updatedAt: AWSDateTime}",
      "Subscription": "type Subscription { subscribeUpdateStatus(id: String!): Status   @aws_subscribe(mutations: [\"updateStatus\"])   @aws_lambda @aws_iam\n }"
    },
    "types_map": {
      "Event": {
        "detail": "String"
      },
      "Input": {
        "id": "String!"
      },
      "Status": {
        "id": "String!",
        "message": "String"
      }
    }
  }
}

```
:::note
We don't need to explictly generate graphql. `tc compose -c mutations -f gql` is useful for debugging purposes.
:::

To validate the generated graphql, do:

```
tc validate -c mutations
```
You should see any errors that are statically determined.


## Components

Components in `mutation` entity:

```sh
tc update -s sandbox -e env -c mutations/authorizer
tc update -s sandbox -e env -c mutations/types
tc update -s sandbox -e env -c mutations/roles
tc update -s sandbox -e env -c mutations/RESOLVER_NAME
```
