# Functions

<!-- toc -->

## Defining functions

There are 2 kinds of function definitions:

1. Local functions
2. Interned functions

### Local functions

tc discovers functions in the current directory. A function is any directory that contains a
1. handler.{py,rb,clj,js} file  and/or
2. function.{json, yml} file


At it's simplest, a function directory (say foo) looks as follows:

```sh
foo/
 - handler.{py, rb, js, clj}
```

tc _infers_ the kind of function, runtime and build instructions. However, we can be more specific as follows in a `function.json`

```json
{
  "name": "foo",
  "runtime": {
    "lang": "python3.11",
    "handler": "handler.handler"
  }
}
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

## Customizing functions

### Permissions

### Runtime

## Building functions

`tc` has a sophisticated function `builder` that can build different kinds of artifacts with various language runtimes (Clojure, Janet, Rust, Ruby, Python, Node)

In the simplest case, when there are no dependencies in a function, we can specify how the code is packed (zipped) as follows in `function.json`:

```json
{
  "name": "simple-function",
  "runtime": {
    "lang": "python3.10",
    "package_type": "zip",
    "handler": "handler.handler",
  },
  "build": {
    "command": "zip -9 lambda.zip *.py",
    "kind": "Code"
  }
}

```
[Example](https://github.com/informed-labs/tc/blob/main/examples/functions/python-basic/function.json)

and then `tc create -s <sandbox> -e <env>` builds this function using the given `command` and creates it in the given sandbox and env.

### Inline

The above is a pretty trivial example and it gets complicated as we start adding more dependencies. If the dependencies are reasonably small (< 50MB), we can inline those in the code's artifact (lambda.zip).

```
{
  "name": "python-inline-example",
  "runtime": {
    "lang": "python3.12",
    "package_type": "zip",
    "handler": "handler.handler",
    "layers": []
  },
  "build": {
    "kind": "Inline",
    "command": "zip -9 -q lambda.zip *.py"
  },
  "test": {
    "fixture": "python run-fixture.py",
    "command": "poetry test"
  }

}
```
[Example](https://github.com/informed-labs/tc/blob/main/examples/functions/python-inline/function.json)

`tc create -s <sandbox> -e <env>` will implicitly build the artifact with _inlined_ deps and create the function in the given sandbox and env. The dependencies are typically in `lib/` including shared objects (.so files).


```admonish info
tc builds the _inlined_ zip using docker and the builder image that is compatible with the lambda runtime image.
````

### Layer

If `inline` build is heavy, we can try to layer the dependencies:

```
{
  "name": "ppd",
  "description": "my python layer",
  "runtime": {
    "lang": "python3.10",
    "package_type": "zip",
    "handler": "handler.handler",
    "layers": ["ppd-layer"]
  },
  "build": {
    "pre": [
      "yum install -y git",
      "yum install -y gcc gcc-c++"
    ],
    "kind": "Layer",

  }
}

```

Note that we have specified the list of layers the function uses. The layer itself can be built independent of the function, unlike `Inline` build kind.

```
tc build --kind layer
tc publish --name ppd-layer
```

We can then create or update the function with this layer. At times, we may want to update just the layers in an existing sandboxed function

```
tc update -s <sandbox> -e <env> -c layers

```


```admonish info
AWS has a limit on the number of layers and size of each zipped layer. tc automatically splits the layer into chunks if it exceeds the size limit (and still within the upper total limit of 256MB)
````

### Image

While `Layer` and `Inline` build kind should suffice to pack most dependencies, there are cases where 250MB is not good enough. Container `Image` kind is a good option. However, building the deps and updating just the code is challenging using pure docker as you need to know the sequence to build. `tc` provides a mechanism to build a `tree` of images. For example:


```json
{
  "name": "python-image-tree-example",
  "runtime": {
    "lang": "python3.10",
    "package_type": "image",
    "handler": "handler.handler"
  },

  "build": {
    "kind": "Image",
    "images": {
      "base": {
		  "version": "0.1.1",
		  "commands": [
			  "yum install -y git wget unzip",
			  "yum install -y gcc gcc-c++ libXext libSM libXrender"
		  ]
      },
      "code": {
		  "parent": "base",
		  "commands": []
      }
    }
  }
}
```

[Example](https://github.com/informed-labs/tc/blob/main/examples/functions/python-image/function.json#L1)

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


```admonish info
It is recommended that the ECR repo has a <namespace>/<label> format. The label can be the image labels specified in function.json:build (base, code etc)
````

#### External parent image

At times, we may need to use a parent image that is shared and defined in another function or build. The following function definition is an example that shows how to specify a parent URI in code image-spec.

```json
{
  "name": "req-external-example",
  "description": "With external parent",
  "runtime": {
    "lang": "python3.10",
    "package_type": "image",
    "handler": "handler.handler"
  },

  "build": {
    "kind": "Image",
    "images": {
      "code": {
	"parent": "{{repo}}/base:req-0.1.1",
	"commands": []
      }
    }
  }
}
```

`parent` in the `code` image-spec is an URI. This is also a way to pin the parent image.

## Components

## Providers

## Composition

## Standalone functions
