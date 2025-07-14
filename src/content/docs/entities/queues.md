---
title: Queues
description: Topology Composer
---

## Spec

```yaml

name: TOPOLOGY-NAME

queues:
  queue1:
    function: function1
```

By default, tc uses `sqs` as the queue.

## Dead-letter queue

```yaml
queues:
  my-dlq:
    function: dlq-handler

functions:
  my-fn:
    queue: my-dlq

```
