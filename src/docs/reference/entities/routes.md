# Routes

<!-- toc -->

## 1. Basic usage

```yaml

name: TOPOLOGY-NAME

routes:
  /foo:
    method: POST
    function: function1
```

## 2. Patterns

### 2.1 Request-response

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

### 2.2 Async request-response

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

### 2.3 Queued requests

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

### 2.4 DAG of handlers

## 3. Authorizers

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

## 4. Templates


## 5. Customization

By default, tc creates gateway with name as that of the 'NAMESPACE_SANDBOX'. However we can override it with a custom name, in which case tc will not manage it
