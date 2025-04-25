# Topology Specification

The topology definition is primarily to define flows.

`topology.yml`


```yaml
name: <topology-name>
infra: path/to/infra  [optional]
nodes: [optional]
	ignore:
		- <unrelated-node>
functions: [optional]
	shared:
		- ../shared/function1
	    - ../shared/function2
events: [optional]
  consumes:
    <EventName>:
      producer: <producerName>
    <EventName>:
      producer: <producerName>
  produces:
    <EventName>:
      consumer: consumerName
routes: [optional]
  <name>:
	kind: rest|http|websocket
    gateway: <API-NAME>
    authorizer: <AUTHORIZER-NAME>
	proxy: none|default|<function-name>
    timeout: INT
    async: BOOL
    method: POST|GET|DELETE
    path: STRING

flow: ./states.json | <definition>  [optional]
```

`infra` is either an absolute or relative path to the infrastructure configs (vars, roles etc). This field is optional and tc tries best to discover the infrastructure path in the current git repo.

`events`, `routes` and `flow` are optional.

`flow` can contain a path to a step-function definition or an inline definition. tc automatically namespaces any inlined or external flow definition.
