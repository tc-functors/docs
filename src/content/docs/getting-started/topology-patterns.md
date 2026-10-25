---
title: Topology Patterns
description: Topology Patterns
---

There are 4 kinds of topology layouts, mostly based on how the functions are structured.

- **nano** - A self-contained topology definition of tiny functions and entities in a single file
- **flat** - A flat directory of single-file handlers with no dependencies or assets
- **thunk** - A directory tree of functions with no dependencies or assets
- **staid** - A directory tree of functions with dependencies, configurations and heavier artifacts.

Let's look at these in detail.

### Nano Topology

A nano topology has *nano* functions that have zero dependencies and have tiny sippets of code. Such functions delegate IO (like writing to S3 etc) to other entities. They don't have any custom infrastructure configs (IAM permissions, env variables etc). These nano functions are generally stateless similar to pure functions in functional programming.

```yaml
name: nano

functions:
  f1:
    runtime:
      lang: python3.14
      code: |
        def handler(event, context):
          return {"pass": "ok"}
  f2:
    runtime:
      lang: ruby3.2
      code: |
        require 'json'
        def handler(event:, context:)
          { event: JSON.generate(event) }
        end

  f3:
    runtime:
      lang: clojure
      code: |
        (defn handler [event]
          (prn event)
          event)

```

### Flat Topology

Flat functions are similar to nano functions except the code reside in separate handler files. This is useful if the handlers are reasonably larger in size but still fit in a single file.

Layout
```sh
.
├── f1.py
├── f2.rb
├── f3.clj
└── topology.yml
```

```yaml
name: flat

functions:
  f1:
    code: ./f1.py
  f2:
    code: ./f2.rb
  f3:
    code: ./f3.clj
```

### Thunk

Thunks are organized by sub-directories with a single file definition and no external dependencies. They can still have custom function.yml definitions but don't require bloated project layouts that are unnecessary in lambdas. Thunks can have custom IAM permissions in infra dir (note the infra dir can be either ./infra or {GIT_ROOT}/infrastructure/tc/<topology>)

```sh
.
├── f1
│   └── handler.rb
├── f2
│   ├── function.yml
│   └── handler.py
├── f3
│   └── handler.js
├── f4
│   └── handler.clj
├── infra
│   ├── roles
│   │   └── f1.json
│   └── vars
│       └── f2.json
└── topology.yml
```

### Staid

Staid functions have language-specific project/function layouts and/or additional build instructions in function.yml. Staid functions generally tend to be heaver. Staids potentially can also shared functions that complicate the build process.

```
.
├── f1
│   ├── function.yml
│   ├── pyproject.toml
│   ├── src
│   │   └── myservice
│   │       └── handler.py
│   ├── tests
│   └── uv.lock
├── f2
│   ├── function.yml
│   ├── Gemfile
│   └── src
│       └── handler.rb
├── f3
│   ├── deps.edn
│   ├── function.yml
│   └── src
│       └── service
│           └── handler.clj
├── infra
│   ├── events.json
│   ├── mutations.json
│   ├── pages.json
│   ├── roles
│   ├── routes.json
│   └── vars
└── topology.yml
```

Of course, we can mix and match different kind of functions in a topology. There is no one kind that is best suited for all usecases. However, nano or flat topologies do leverage the power of tc in offloading IO to other entities and keep functions pure.

Now that we have a sense of how our topologies look like, let's take a few look at some [examples](/examples/rest-api) and learn how these functions and entities are composed.
