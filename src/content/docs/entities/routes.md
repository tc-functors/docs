---
title: Routes
description: Routes Entity Reference
---

## Spec

```yaml

name: TOPOLOGY-NAME

routes:
  NAME_OR_PATH:
    gateway: <String>
    authorizer: <String>
    method: POST|GET|DELETE
    path: <String>
    async: false
    function: <String>
    state: <String>
    queue: <String>
    event: <String>
    request_template: <String>
    response_template: <String>
    stage: <String>
    stage_variables: <Map>
    CORS:
      methods: [GET, POST]
      origins: ["*"]
      headers: [String]

```

Gateway is optional and required if you need to use an existing gateway. By default, tc creates a gateway with the name of the topology (namespace).

## Authorizer

```
name: TOPOLOGY-NAME

routes:
  /foo:
    method: POST
	authorizer: my-authorizer
    function: function1

functions:
  my-authorizer:
	uri: ../my-other/authorizer
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

### Async request-response

```yaml
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

### Queued Requests

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
