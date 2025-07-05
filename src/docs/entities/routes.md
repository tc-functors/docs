# Routes

<!-- toc -->

```yaml

name: TOPOLOGY-NAME

routes:
  /foo:
    authorizer: my-authorizer
    method: POST
    function: function1
```

### Simple request-response

By default, the entity targets are synchronous.

```yaml

name: request-response

routes:
  /api/ping:
    method: GET
    path: "/api/user"
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

### Queuing requests

### Customization

By default, tc creates gateway with name as that of the 'NAMESPACE_SANDBOX'. However we can override it with a custom name, in which case tc will not manage it
