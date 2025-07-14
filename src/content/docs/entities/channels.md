---
title: Channels
description: Channels
---

A channel is an abstraction for bidierctional websocket streams.

```yaml
channels:
  my-room:
    function: process
```

`function` in this context is either an  an inline javascript handler. For example:

```yaml
channels:
  my-room:
    function: path/to/handler.js
```

## Authorizer

wip
