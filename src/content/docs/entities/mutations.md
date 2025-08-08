---
title: Mutations
description: Mutations Entity Reference
---

## Definitions

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

tc generates `graphql` for the above mutation definition.


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


We don't need to explictly generate graphql. `tc compose -c mutations -f gql` is useful for debugging purposes.

## Implict Types

`tc` provides a set of convenient implicit Types. These Types capture the shape or path access in input entity's payload.

```

|                | Input Path        | Input Entity | Target Type |
|----------------|-------------------|--------------|-------------|
| Event          | $.detail          | Event        | String      |
| EventData      | $.detail.data     | Event        | String      |
| EventDataJSON* | $.detail.data     | Event        | AWSJSON     |
| EventMetadata  | $.detail.metadata | Event        | String      |

## Components

Components in `mutation` entity:

```sh
tc update -s sandbox -e env -c mutations/authorizer
tc update -s sandbox -e env -c mutations/types
tc update -s sandbox -e env -c mutations/roles
tc update -s sandbox -e env -c mutations/RESOLVER_NAME
```
