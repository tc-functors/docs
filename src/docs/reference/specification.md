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



## Function Specification

function.json file in the function directory is optional. `tc` infers the language and build instructions from the function code. However, for custom options, add a function.json that looks like the following


```json

{
  "name": String,
  "runtime": RuntimeSpec,
  "build": BuildSpec,
  "infra": InfraSpec,
  "test": TestSpec
}

```


### RuntimeSpec

| Key                     | Default           | Optional? | Comments                    |
|-------------------------|-------------------|-----------|-----------------------------|
| lang                    | Inferred          | yes       |                             |
| handler                 | handler.handler   |           |                             |
| package_type            | zip               |           | possible values: zip, image |
| uri                     | file:./lambda.zip |           |                             |
| mount_fs                | false             | yes       |                             |
| snapstart               | false             | yes       |                             |
| memory                  | 128               | yes       |                             |
| timeout                 | 30                | yes       |                             |
| provisioned_concurrency | 0                 | yes       |                             |
| reserved_concurrency    | 0                 | yes       |                             |
| layers                  | []                | yes       |                             |
| extensions              | []                | yes       |                             |
| environment             | {}                | yes       | Environment variables       |



### BuildSpec


### JSON Spec

```json
{
  "name": "string",
  // Optional
  "dir": "string",
  // Optional
  "description": "string",
  // Optional
  "namespace": "string",
  // Optional
  "fqn": "string",
  // Optional
  "layer_name": "string",
  // Optional
  "version": "string",
  // Optional
  "revision": "string",
  // Optional
  "runtime": {
    "lang": "Python39" | "Python310" | "Python311" | "Python312" | "Python313" | "Ruby32" | "Java21" | "Rust" | "Node22" | "Node20",
    "handler": "string",
    "package_type": "string",
    // Optional
    "uri": "string",
    // Optional
    "mount_fs": true,
    // Optional
    "snapstart": true,
    "layers": [
      "string",
      /* ... */
    ],
    "extensions": [
      "string",
      /* ... */
    ]
  },
  // Optional
  "build": {
    "kind": "Code" | "Inline" | "Layer" | "Slab" | "Library" | "Extension" | "Runtime" | "Image",
    "pre": [
      "dnf install git -yy",
      /* ... */
    ],
    "post": [
      "string",
      /* ... */
    ],
    // Command to use when build kind is Code
    "command": "zip -9 lambda.zip *.py",
    "images": {
      "string": {
        // Optional
        "dir": "string",
        // Optional
        "parent": "string",
        // Optional
        "version": "string",
        "commands": [
          "string",
          /* ... */
        ]
      },
      /* ... */
    },
    "layers": {
      "string": {
        "commands": [
          "string",
          /* ... */
        ]
      },
      /* ... */
    }
  },
  // Optional
  "infra": {
    "dir": "string",
    // Optional
    "vars_file": "string",
    "role": {
      "name": "string",
      "path": "string"
    }
  }
}
```

# Infrastructure Spec

## Runtime Variables

Default Path: infrastructure/tc/<topology>/vars/<function>.json
Override: infra.vars_file in function.json


```json
{
  // Optional
  "memory_size": 123,
  // Optional
  "timeout": 123,
  // Optional
  "image_uri": "string",
  // Optional
  "provisioned_concurrency": 123,
  // Optional
  "reserved_concurrency": 123,
  // Optional
  "environment": {
    "string": "string",
    /* ... */
  },
  // Optional
  "network": {
    "subnets": [
      "string",
      /* ... */
    ],
    "security_groups": [
      "string",
      /* ... */
    ]
  },
  // Optional
  "filesystem": {
    "arn": "string",
    "mount_point": "string"
  },
  // Optional
  "tags": {
    "string": "string",
    /* ... */
  }
}
```

## Roles
