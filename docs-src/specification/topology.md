# Topology Specification

`topology.yml`


```yaml
name: <namespace>
infra: <infra-path>

nodes:
  ignore: [<path>]
  dirs: [<path>]

functions:
  shared: [<rel path>]
  remote: [<git url>]
  dirs: [<dir path>]

events:
  EventName:
    producer: <String>
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
