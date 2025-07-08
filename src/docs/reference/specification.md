# Topology Specification

`topology.yml`


```yaml
name: String
infra: <String>
recursive: <false>

nodes:
  ignore: [<path>]
  dirs: [<path>]

functions:
  FunctionName:
    uri: <String>
    function: <String>
    event: <String>
    queue: <String>
    runtime:
      lang: "Python39" | "Python310" | "Python311" | "Python312" | "Python313" | "Ruby32" | "Java21" | "Rust" | "Node22" | "Node20"
      handler: handler.handler
      package_type: zip | image
    build:
      kind: Inline | Image
      command: zip -9 lambda.zip *.py

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
  RoutePath:
    gateway: <String>
    authorizer: <String>
    method: <POST|GET|DELETE>
    path: <String>
    async: false
    function: <String>
    state: <String>
    queue: <String>
    request_template: <String>
    response_template: <String>
    stage: <String>
    stage_variables: <Map>
    CORS:
      methods: [GET, POST]
      origins: ["*"]
      headers: [String]

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

pages:
  my-app:
    kind: SPA | PWA | Static
    dist: <Path>
    dir: <String>
    build: <String>

states: ./states.json | <Amazon States Language>

```

`infra` is either an absolute or relative path to the infrastructure configs (vars, roles etc). This field is optional and tc tries best to discover the infrastructure path in the current git repo.

`events`, `routes`, `functions`, `mutations`, `channels` and `flow` are optional.

`flow` can contain a path to a step-function definition or an inline definition. tc automatically namespaces any inlined or external flow definition.



## Function Specification

function.json file in the function directory is optional. `tc` infers the language and build instructions from the function code. However, for custom options, add a function.json that looks like the following


```yaml
name: String
runtime: RuntimeSpec
build: BuildSpec
test: TestSpec
```

Expanded:

```yaml
name: String
namespace: <String>
fqn: <String>
version: <String>
runtime:
  lang: "python3.10" | "python3.11" | "python3.12" | "python3.13" | "ruby3.2" | "java21" | "rust" | "node22" | "node20"
  handler: handler.handler
  package_type: "zip | image"
  uri: <String>
  mount_fs: false
  snapstart: false
  layers: []
  extensions: []
build:
  kind: "Code" | "Inline" | "Layer" | "Slab" | "Library" | "Extension" | "Runtime" | "Image"
  pre: []
  post: []
  command: "zip -9 lambda.zip *.py"
  images: <ImageTree>
  layers: <Map>

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

`ImageTree` is a tree of images

```
  images:
    base:
      commands: [String]
    code:
      commands: [String]
```

Tree depth is limited to 4.


# Infrastructure

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
