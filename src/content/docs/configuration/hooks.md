---
title: Hooks
description: Hooks
---

`hooks` are set of commands and actions that are run before (`pre`) and after (`post`) sandbox creation. They are wrappers around `tc create` command.
The hooks are defined per topology in it's corresponding infra dir (`INFRA_DIR/TOPOLOGY/hooks.json`)

Example:

```
{
  "pre": [
    {
      "command": "tc build --kind extension",
      "dir": "./extensions/bg-task",
      "on_failure": "exit"
    }
  ],
  "post": [
    {
      "command": "tc test -s {{sandbox}} -e {{env}}",
      "on_failure": "exit"
    }
  ]
}
```

In the above, building an extension is run before creating the topology and test is run after creating the topology in a sandbox.
The hooks are run sequentially. `on_failure` specifies a command to run or identifiers like `exit`, `notify` etc.
