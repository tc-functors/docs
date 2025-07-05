# Mutations

<!-- toc -->

### Defining resolvers

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
```

### Example: Job Tracker


Let's explore an example that uses _Mutations_ to track status of arbitrary jobs

```yaml

name: job-tracker
events:
  CompleteTask:
    producer: adHoc
	mutation: completeJob

mutations:
  authorizer: '{{namespace}}_authorizer_{{sandbox}}'
  types:
    JobInput:
      id: String!
    Job:
      id: String!
      status: String
      message: String

  resolvers:
    listJobs:
      function: 'lister'
      input: JobInput
      output: Job
      subscribe: false

    startJob:
      function: 'starter'
      input: JobInput
      output: Job
      subscribe: true

    completeJob:
      function: 'completer'
      input: Event
      output: Job
      subscribe: true
```
