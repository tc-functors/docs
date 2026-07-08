---
title: Specification in YAML
description: Specification in YAML
---

## Topology Specification

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

## Macros

The following are some topology macros that can be inserted in topology.yml file.


### !include

You could break out the entities if they are large in number and hard to manage. Something like:

```yaml
name: my-topology
routes: !include ./routes.yml
events: !include ./events.yml
mutations: !include ./mutations.yml
...
```

### !read

Sometimes we'd like to not include entity blocks but split an entity block into multiple files. We could use the !read macro for that

```
name: my-topology

routes:
  !read ./vertical1.yml
  !read ./vertical2.yml
```
Where vertical1.yml and vertical2.yml can contain the actual routes.

vertical1.yml

```yaml
/foo:
  method: GET
  vertical: v1
```

### !sexp

We can inline s-expressions/Lisp to express the entities. For example

```yaml
name: my-topology

!sexp ./topology.lisp
```

Where topology.lisp

```lisp
(define-event e1)

(define-event e2)

(define-function f1
    :uri "./f1"
    :runtime {:lang "python3.11"}
    :build {:kind 'inline})

(define-function f2
    :uri "./f2"
    :runtime {:lang "ruby3.3"}
    :build {:kind 'inline})

```
