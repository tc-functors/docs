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
      "DB_HOST": "dev.db.net",
      "API_GATEWAY_URL": "{{API_GATEWAY_URL}}"
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

We can also discover Endpoints for routes and mutations that are sandbox-specific. tc does a topological sort and gets the URLs ahead of time before rendering the vars.json file.


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
  handler: handler.handler
```
[Example](https://github.com/informed-labs/tc/blob/main/examples/functions/python-basic/function.yml)

The above is a pretty trivial example and it gets complicated as we start adding more dependencies. We can specify how the function needs to be built. For example:


```yaml
name: funciton-with-deps-example
runtime:
  lang: python3.10 | python3.11 | python3.12 | ruby3.2
  handler: handler.handler
build:
  kind: Code |Inline |Image | Layer
  pre: [String]
  post: [<String>]
  command: <String>
```

| Attribute     | Description                                                                                                                                                                                                                                                                              |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| kind          | Specifies how the dependencies are packaged <br> Available options are Code, Inline, Image, Layer                                                                                                                                                                                        |
| pre           | Array of commands to run before the dependencies are installed. <br>  Has shared build context, Host ssh-agent access. Typically useful to install system dependencies (yum) or private packages (ssh://github etc)                                                                      |
| post          | Array of commands to run after the dependencies are installed. <br> Has shared build context, Host ssh-agent access and AWS access for given sandbox or centralized repo. Typically useful to pull models, CSV files etc from S3 or object stores and package them in the build artifact |
| command       | Command to pack the code. <br> Typically it is the zip command (zip -9 -q lambda.zip *)                                                                                                                                                                                                  |
| share_context | Default: true. If true, copied current git repository for referencing any shared relative paths in the build container                                                                                                                                                                   |
| skip_dev_deps | Default: false. Skips dev dependencies when building deps                                                                                                                                                                                                                                |

:::note
The build kinds are interchangeable. All of the build kinds take the same options. We can replace Image with Inline at any point if the size is reasonable (< 50MB) and it will just work.
:::




and then `tc create -s <sandbox> -e <env>` builds this function using the given `command` and creates it in the given sandbox and env.

### Inline

If the dependencies are reasonably small (< 50MB), we can inline those in the code's artifact (lambda.zip).

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
[Example](https://github.com/informed-labs/tc/blob/main/examples/functions/python-inline/function.yml)

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
  handler: handler.handler
  layers:
   - ppd-layer
build:
  kind: Layer
  pre:
   - yum install -y git
   - yum install -y gcc gcc-c++


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


### Image

While `Layer` and `Inline` build kind should suffice to pack most dependencies, there are cases where 250MB is not good enough. Container `Image` kind is a good option. For example:


```yaml
name: python-image-tree-example
runtime:
  lang: python3.10
  package_type: image
  handler: handler.handler
build:
  kind: Image
```
```
tc build --publish
```

Note that the child image uses the parent's version of the image as specified in the parent's block.

#### Syncing base images

While we can `docker pull` the base and code images locally, it is cumbersome to do it for all functions recursively by resolving their versions. `tc build --sync` pulls the base and code images based on current function checksums. Having a copy the base or parent code images allows us to do incremental updates much faster.

#### Inspecting the images

We can run `tc build --shell` in the function directory and access the bash shell. The shell is always on the `code` image of the current function checksum. Note that the `code` image using the Lambda Runtime Image as the source image.


:::tip

It is recommended that the ECR repo has a <namespace>/<label> format. The label can be the image labels specified in function.yml:build (base, code etc)

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

## Layer lifecycle management

On AWS, the layer versions are global and are not sandbox-aware. When associating layers with a function, we can pin the layers with monotonic versions as follows:

```yaml
name: ppd
runtime:
  lang: python3.10
  package_type: zip
  handler: handler.handler
  layers:
   - ppd-layer:3
```
However, this may not be practical when dealing with a large number of functions. Additionally, there is no way to tag layers and annotate if the version is stable or unusable. To solve this problem, tc provides a simple mechanism to differentiate between stable and dev layers. When creating a layer by default using `tc build --layer <layer-name>`, the layer's name is suffixed with the string `-dev`. On updating the sandbox with the layers or when creating/updating functions, tc will bump the functions to the latest "dev" layer versions.
When a specific `dev` layer is ready to be _promoted_ as _stable_, we do

```sh
tc build --promote --layer NAME [--version 123]
```

If the version is not specified, tc will promote the latest dev layer to stable.

If a sandbox is named `stable`, it will use the stable layers. This is configurable in TC_CONFIG.

To use latest stable layers in your dev sandboxes, do:

```sh
TC_USE_STABLE_LAYERS=1 tc update -s SANDBOX -e PROFILE -c functions/layers
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
