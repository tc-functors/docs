---
title: Interactive
description: Interactive Mode
---

Most `tc` commands have an interactive mode. This is a convenient mode to interact with the sandbox.

[![Entity image]][Entity source]

[Entity image]: ../../../assets/interactive.gif
[Entity source]: ../../../assets/interactive.gif

Following commands currently have an interactive mode:

```
tc update -s SANDBOX -e PROFILE --[i]nteractive
tc test -s SANDBOX -e PROFILE --[i]nteractive
tc sync -s SANDBOX -e PROFILE --[i]nteractive
```

It is particularly useful in incremental updates of a sandbox during development and testing.
