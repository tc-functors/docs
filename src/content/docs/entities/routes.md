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
## Sandbox-specific configuration

We can set custom domains in a configuration, typically in INFRA_DIR/<topology>/routes.json

```json
{
    "domains": {
        "default": {
            "stable": "service.mydomain.com",
            "dev": "dev.mydomain.com"
        },
        "prod": {
            "stable": "prod.mydomain.com"
        }
    },
    "throttling": {
        "default": {
            "stable": {
                "burst_limit": 120,
                "rate_limit": 90
            },
            "alper": {
                "burst_limit": 120,
                "rate_limit": 90
            }
        }
    }
}

```

## Path-based routing with single custom domain

We can configure API mappings to different gateways. For example, consider the following routes spec:

```yaml
routes:
  /v1/foo/test:
    method: GET
    gateway: g1_{{sandbox}}
    function: foo
  /v1/bar/test:
    method: GET
    gateway: g2_{{sandbox}}
    function: foo
```

In this spec, we have configured /v1/foo/test and /v1/bar/test to use different gateways. If there is a `{{sandbox}}` template variable specified, tc will create these gateways and configure the routes in them.

To configure the custom domain API mappings, we specify the path-based routing in `{INFRA_DIR}/routes.json` file. For example, lets say we want `/v1/foo` and `/v1/bar` prefixes to route to different sandboxes:

```json
{
  "gateway_mapping": {
    "api.dev.functors.org": {
      "g1_stable": ["/v1/foo"],
      "g2_stable": ["/v1/bar"]
    }
  },
  "domains": {
    "default": {
      "stable": "api.{{env}}.functors.org"
    }
  }
}

```
Here tc will set up the api mapping to the right sandboxed gateway.

:::note
Path prefixes in routes.json should not contain a trailing '/'. It's also recommended that prefixes are unique enough that they capture the resource scope.

:::


## Default configuration

At times, we may want to define the defaults for all the routes. For example:

```yaml
routes:
  default:
    doc-only: true
    gateway: my-gateway
    CORS:
      methods: [GET, POST]
      origins: ["*"]
      headers: [String]

  /foo:
    method: GET

  /bar:
    method: GET

```
Here we set the defaults for all routes in the topology. The individual route can still override the default.
