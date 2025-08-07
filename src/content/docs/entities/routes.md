---
title: Routes
description: Routes Entity Reference
---

## Spec

```yaml

name: TOPOLOGY-NAME

routes:
  /foo:
    method: POST
    function: function1

```

## Patterns

### Request-response

By default, the entity targets are synchronous.

```yaml

name: request-response

routes:
  /api/ping:
    method: GET
    function: fetcher
```

```sh
tc create -s john -e dev
...
```

### Async request-response

```yaml
name: TOPOLOGY-NAME

routes:
  /api/message:
    method: POST
	async: true
	event: GetMessages

events:
  GetMessages:
	producer: fetcher
	channel: messages

channels:
  messages:
	function: default
```

### Queued requests

```yaml

routes:
  /foo:
    authorizer: my-authorizer
    method: POST
    queue: foo-queue

queues:
  foo-queue:
    mode: FIFO
    function: function1

```

### DAG of handlers

wip


## Authorizers

```yaml

name: TOPOLOGY-NAME

routes:
  /foo:
    method: POST
    function: function1

functions:
  authorizer:
	uri: ../my-other/authorizer
```
