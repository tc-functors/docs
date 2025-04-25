# Builder

<!-- toc -->

`tc` has a sophisticated `builder` that can build different kinds of artifacts with various language runtimes (Clojure, Janet, Rust, Ruby, Python, Node)

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
[Example](https://github.com/informed-labs/tc/blob/main/examples/patterns/02-builders/python-basic/function.json)

and then `tc create -s <sandbox> -e <env>` builds this function using the given `command` and creates it in the given sandbox and env.

## Inline

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
[Example](https://github.com/informed-labs/tc/blob/main/examples/patterns/02-builders/python-inline/function.json)

`tc create -s <sandbox> -e <env>` will implicitly build the artifact with _inlined_ deps and create the function in the given sandbox and env. The dependencies are typically in `lib/` including shared objects (.so files).


```admonish info
tc builds the _inlined_ zip using docker and the builder image that is compatible with the lambda runtime image.
````

## Layer

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

## Image

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

[Example](https://github.com/informed-labs/tc/blob/main/examples/patterns/02-builders/python-image/req/function.json#L1)

In the above example, we define the `base` image with dependencies and `code` image that packs just the code. Note that `code`  references `base` as the _parent_. Effectively, we can build a tree of images (say base dependencies, models, assets and code). These `images` can be built at any point in the lifecycle of the function. To build the `base` image do:

```sh
tc build --image base --publish
```

When `--publish` is specified, it publishes to the configured ECR repo [See Configuration]. Alternatively, `TC_ECR_REPO` env variable can be specified to override the config. The value of variable is the ECR repo URI


With python functions, the image can be built either by having a 'requirements.txt' file in the function directory or a pyproject.toml. `tc build` works with requirements.txt and poetry. See [poetry example](https://github.com/informed-labs/tc/blob/main/examples/patterns/02-builders/python-image/pyp/function.json#L6)

When all "parent" images have been built, `tc create` will create the `code` image just-in-time. The tag is the SHA1 checksum of the function directory. The code tag is typically of the format "{{repo}}/code:req-0d4043e5ae0ebc83f486ff26e8e30f3bd404b707""

We can also optionally build the `code` image.

```
tc build --image code --publish
```

Note that the child image uses the parent's version of the image as specified in the parent's block

```admonish info
It is recommended that the ECR repo has a <namespace>/<label> format. The label can be the image labels specified in function.json:build (base, code etc)
````

### External parent image

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
[Example](https://github.com/informed-labs/tc/blob/main/examples/patterns/02-builders/python-image/req-external/function.json#L20)

`parent` in the `code` image-spec is an URI. This is also a way to pin the parent image.

## Slab

`slab` is an abstraction for building depedencies, assets and serving it via a network filesystem (EFS). An example function with slab looks like:

```json
{
  "name": "python-example-snap",
  "description": "example function",
  "runtime": {
    "lang": "python3.12",
    "package_type": "zip",
    "mount_fs": true,
    "handler": "handler.handler",
    "layers": []
  },
  "build": {
    "kind": "slab"
  }
  "test": {
    "fixture": "python run-fixture.py",
    "command": "poetry test"
  }

}
```

```
tc build --kind slab --publish

```
This publishes the slab  to EFS as configured (See Configuration)


## Library

A library is a kind of build that recursively packs a collection of directories to serve as a single library in the target runtime.

For example, let's say we have the following directory structure

```
lib/
|-- bar
|   `-- lib.rb
|-- baz
|   `-- lib.rb
`-- foo
    `-- lib.rb

```

We can pack this as a library and publish it as a layer or a node in the image-tree. By default, tc publishes it as a layer.
```
cd lib
tc build --kind library --name mylib --publish --lang ruby
```

Why can't this just be of kind `layer` ? Layers typically have the dependencies resolved. Library is just standalone.


## Extension

Lambda extensions are like sidecars that intercept the input/output payload events and can do arbitrary processing on them.

```
tc build --kind extension
```


## Recursive Builds

To traverse through the topology and build the depedencies or code in parallel, do the following:

```
tc build [-kind code|image|layer] --recursive --publish
```
