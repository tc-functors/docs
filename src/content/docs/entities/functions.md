---
title: Functions
description: Functions Entity Reference
---

## Definitions

There are 3 kinds of function definitions:

1. Topology functions
2. Interned functions
3. Standalone functions

### Topology functions

tc discovers functions in the current directory. A function is any directory that contains a
1. handler.{py,rb,clj,js} file  and/or
2. function.yml file

At it's simplest, a function directory (say foo) looks as follows:

```sh
foo/
 - handler.{py, rb, js, clj}
```

tc _infers_ the kind of function, runtime and build instructions. However, we can be more specific as follows in a `function.yml` file

```yaml
name: foo
runtime:
  lang: python3.11
  handler: handler.handler
```

### Interned functions

Interned functions are those that are explicitly defined in topology.yml

```yaml

functions:
  fun1:
    uri: ../my-fun1
  fun2:
    uri: ../my-fun2

```

### Standalone functions

A function that does belong to a topology or has no topology defined is a _standalone_ function.

```yaml
name: foo
runtime:
  lang: python3.11
  handler: handler.handler
```

## Components

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



### Permissions

By default, tc infers permissions and sets the right boundaries in the sandbox. However, you may need to override the permissions by specifying a custom _roles_ file in `$INFRA_ROOT` (say $GIT_ROOT/infrastructure/tc/TOPOLOGY-NAME/roles/FUNCTION-NAME.json. The contents of the roles file is typically the IAM policy.

### Environment variables

Specify env variables in $GIT_ROOT/infrastructure/tc/TOPOLOGY-NAME/vars/FUNCTION-NAME.json

```json
{
  "default": {
    "timeout": 120,
    "memory_size": 128,
    "environment": {
      "API_KEY": "ssm:/path/to/api-key",
      "DB_HOST": "dev.db.net"
    }
  },
  "prod": {
    "timeout": 60,
    "memory_size": 1024,
    "environment": {
      "API_KEY": "ssm:/path/to/api-key",
      "DB_HOST": "prod.db.net"
    }
  },
  "SANDBOX-NAME": {
    "timeout": 60,
    "environment": {
      "API_KEY": "ssm:/path/to/api-key"
    }
  }
}

```
The `vars` or runtime file is map of default and sandbox-specific overrides. Environment variables in the runtime file can be either an URI or plain text. Supported URIs are `ssm:/` , `s3:/` and `file:/`. If an URI is specified, tc resolves the values and injects them as actual values when creating the lambda. Decryption using `extensions` is also available. See Extensions.


### Update components

tc provides mechanisms to update specific component of entities or topology in a given sandbox. This is incredibly useful when developing your core topology.

```sh
tc update -s sandbox -e env -c functions/layers
tc update -s sandbox -e env -c functions/vars
tc update -s sandbox -e env -c functions/concurrency
tc update -s sandbox -e env -c functions/runtime
tc update -s sandbox -e env -c functions/tags
tc update -s sandbox -e env -c functions/roles
tc update -s sandnox -e env -c functions/function-name
```

## Dependencies

`tc` has a sophisticated function `builder` that can build different kinds of artifacts with various language runtimes (Clojure, Janet, Rust, Ruby, Python, Node)

In the simplest case, when there are no dependencies in a function, we can specify how the code is packed (zipped) as follows in `function.yml`:

```yaml
name: simple-function
runtime:
  lang: python3.10
  package_type: zip
  handler: handler.handler
```
[Example](https://github.com/informed-labs/tc/blob/main/examples/entities/functions/python-basic/function.yml)

and then `tc create -s <sandbox> -e <env>` builds this function using the given `command` and creates it in the given sandbox and env.

### Inline

The above is a pretty trivial example and it gets complicated as we start adding more dependencies. If the dependencies are reasonably small (< 50MB), we can inline those in the code's artifact (lambda.zip).

```yaml
name: python-inline-example
runtime:
  lang: python3.12
  package_type: zip
  handler: handler.handler
build:
  kind: Inline
  command: zip -9 -q lambda.zip *.py
```
[Example](https://github.com/informed-labs/tc/blob/main/examples/entities/functions/python-inline/function.yml)

`tc create -s <sandbox> -e <env>` will implicitly build the artifact with _inlined_ deps and create the function in the given sandbox and env. The dependencies are typically in `lib/` including shared objects (.so files).


:::note
tc builds the _inlined_ zip using docker and the builder image that is compatible with the lambda runtime image.
:::

### Layer

If `inline` build is heavy, we can try to layer the dependencies:

```yaml
name: ppd
runtime:
  lang: python3.10
  package_type: zip
  handler: handler.handler
  layers:
   - ppd-layer
build:
  pre:
   - yum install -y git
   - yum install -y gcc gcc-c++
  kind: Layer

```

Note that we have specified the list of layers the function uses. The layer itself can be built independent of the function, unlike `Inline` build kind.

```
tc build --kind layer
tc publish --name ppd-layer
```

We can then create or update the function with this layer. At times, we may want to update just the layers in an existing sandboxed function

```sh
tc update -s <sandbox> -e <env> -c layers

```
:::note
AWS has a limit on the number of layers and size of each zipped layer. tc automatically splits the layer into chunks if it exceeds the size limit (and still within the upper total limit of 256MB)
:::


### Library

A library is a special kind of layer where there are no transitive dependencies packed into the layer artifact. This is useful if we have a directory of utilities.

```
lib/foo
   - bar
   - baz
```

```sh
tc build --kind library --name foo --publish -e <env>
```

`foo` now can be used a regular layer in function.yml:runtime:layers


### Image

While `Layer` and `Inline` build kind should suffice to pack most dependencies, there are cases where 250MB is not good enough. Container `Image` kind is a good option. However, building the deps and updating just the code is challenging using pure docker as you need to know the sequence to build. `tc` provides a mechanism to build a `tree` of images. For example:


```yaml
name: python-image-tree-example
runtime:
  lang: python3.10
  package_type: image
  handler: handler.handler
build:
  kind: Image
  images:
    base:
      version: 0.1.1
      commands:
      - yum install -y git wget unzip
      - yum install -y gcc gcc-c++ libXext libSM libXrender
    code:
      parent: base
      commands: []
```

[Example](https://github.com/informed-labs/tc/blob/main/examples/entities/functions/python-image/function.yml#L1)

In the above example, we define the `base` image with dependencies and `code` image that packs just the code. Note that `code`  references `base` as the _parent_. Effectively, we can build a tree of images (say base dependencies, models, assets and code). These `images` can be built at any point in the lifecycle of the function. To build the `base` image do:

```sh
tc build --image base --publish
```

When `--publish` is specified, it publishes to the configured ECR repo [See Configuration]. Alternatively, `TC_ECR_REPO` env variable can be specified to override the config. The value of variable is the ECR repo URI


With python functions, the image can be built either by having a 'requirements.txt' file in the function directory or a pyproject.toml. `tc build` works with requirements.txt and poetry.

When all "parent" images have been built, `tc create` will create the `code` image just-in-time. The tag is the SHA1 checksum of the function directory. The code tag is typically of the format "{{repo}}/code:req-0d4043e5ae0ebc83f486ff26e8e30f3bd404b707""

We can also optionally build the `code` image.

```
tc build --image code --publish
```

Note that the child image uses the parent's version of the image as specified in the parent's block.

#### Syncing base images

While we can `docker pull` the base and code images locally, it is cumbersome to do it for all functions recursively by resolving their versions. `tc build --sync` pulls the base and code images based on current function checksums. Having a copy the base or parent code images allows us to do incremental updates much faster.

#### Inspecting the images

We can run `tc build --shell` in the function directory and access the bash shell. The shell is always on the `code` image of the current function checksum. Note that the `code` image using the Lambda Runtime Image as the source image.


:::tip

It is recommended that the ECR repo has a <namespace>/<label> format. The label can be the image labels specified in function.yml:build (base, code etc)

:::


#### External parent image

At times, we may need to use a parent image that is shared and defined in another function or build. The following function definition is an example that shows how to specify a parent URI in code image-spec.

```yaml
name: req-external-example
runtime:
  lang: python3.10
  package_type: image
  handler: handler.handler
build:
  kind: Image
  images:
    code:
      parent: '{{repo}}/base:req-0.1.1'
      commands: []


```

`parent` in the `code` image-spec is an URI. This is also a way to pin the parent image.

### Filesystems

We can mount a filesystem by specifying a runtime attribute `mount_fs`:

```yaml
name: fn-with-fs
runtime:
  lang: python3.11
  package_type: image
  mount_fs: true
  handler: handler.handler
```



## Providers

Default function provider is `Lambda`. We can make the same function code run in ECS Fargate with no change.

```yaml
name: python-image-fargate
runtime:
  handler: "python handler.py"
  package_type: image
  provider: Fargate
build:
  kind: Image
  images:
    base:
      version: 0.1.1
      commands: []
    code:
      parent: base
      commands: []
```

## Testing

### Invoke

By default, tc picks up a `payload.json` file in the current directory. You could optionally specify a payload file

```
tc invoke --sandbox main --env dev --payload payload.json
```

or via stdin
```
cat payload.json | tc invoke --sandbox main --env dev
```

or as a param
```
tc invoke --sandbox main --env dev --payload '{"data": "foo"}'
```

### Emulate

To emulate the Lambda Runtime environment. The following command spins up a docker container with the defined layers in function.yml, sets up the paths, environment variables, AWS access, local code and runtime parameters (mem, handlers etc)

```sh
cd <function-dir>
tc emulate
```

To run in foreground

```
tc emulate
```

You can now invoke a payload locally with this emulator

```
tc invoke --local [--payload <payload.json | json-str>]
```
