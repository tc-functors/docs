# Tutorial ETL-mutations

In the [Getting Started] example we created an ETL topology using events and stepfunction/states. Appsync Graphql Mutations offer us another way to define the flow between the entities.


```yaml
name: etl-mut

routes:
  /start-etl:
    gateway: api-test
    function: '{{namespace}}_enhancer_{{sandbox}}'
    kind: http
    timeout: 10
    async: false
    method: POST


events:
  EnhancerComplete:
    producer: enhancer
    function: '{{namespace}}_transformer_{{sandbox}}'

  TransformerComplete:
    producer: transformer
    function: '{{namespace}}_loader_{{sandbox}}'

mutations:
  authorizer: '{{namespace}}_authorizer_{{sandbox}}'
  types:
    Input:
      id: String!
    Status:
      id: String!
      status: String
      message: String
      percentage: Int

  resolvers:
    initialize:
      function: '{{namespace}}_initializer_{{sandbox}}'
      input: Input
      output: Status
      subscribe: true

    enhance:
      function: '{{namespace}}_enhancer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    transform:
      function: '{{namespace}}_transformer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    load:
      function: '{{namespace}}_loader_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    complete:
      function: '{{namespace}}_completer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true
```
