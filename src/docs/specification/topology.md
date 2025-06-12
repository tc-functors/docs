# Topology Specification

`topology.yml`


```yaml
name: <namespace>
infra: <infra-path>

nodes:
  ignore: [<path>]
  dirs: [<path>]

functions:
  FunctionName:
    uri: <String>
    function: <String>
    event: <String>
    queue: <String>
    runtime: RuntimeSpec
    build: BuildSpec

events:
  EventName:
    producer: <String>
	doc_only: <false>
	nth: <sequence int>
	filter: <String>
	rule_name: <String>
    functions: [<String>]
    function: <String>
    mutation: <String>
    channel: <String>
    queue: <String>
    state: <String>

routes:
  Path:
    gateway: <String>
    authorizer: <String>
    method: <POST|GET|DELETE>
	path: <String>
    sync: <true>
    request_template: <String>
    response_template: <String>
    stage: <String>
    stage_variables: <String>
    function: <String>
    state: <String>
    queue: <String>

channels:
  ChannelName:
    function: <String>
    event: <String>

mutations:
  MutationName:
    function: <String>

queues:
  QueueName:
    function: <String>

states: ./states.json | <definition>  [optional]

```

`infra` is either an absolute or relative path to the infrastructure configs (vars, roles etc). This field is optional and tc tries best to discover the infrastructure path in the current git repo.

`events`, `routes`, `functions`, `mutations`, `channels` and `flow` are optional.

`flow` can contain a path to a step-function definition or an inline definition. tc automatically namespaces any inlined or external flow definition.


## Entity Matrix

Not all entities are composable with each other. The following shows the compatibility Matrix and their implementation status


|          | Function | Event | Queue | Route | Channel | Mutation |
|----------|----------|-------|-------|-------|---------|----------|
| Function | No*      | No    | No*   | No    | No      | No       |
| Event    | Yes      | No    | No    | No    | Yes     | No       |
| Route    | Yes      | No*   | No*   | -     | No      | No       |
| Queue    | Yes      | No    | -     | No    | No      | No       |
| Channel  | Yes      | Yes   | No    | No    | -       | No       |
| Mutation | Yes      | No*   | No    | No    | No      | -        |

```admonish info
* indicates that it is currently being implemented
```
