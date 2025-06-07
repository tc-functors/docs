# Patterns

<!-- toc -->

WIP

## 1. Request-Response

```yaml

name: request-response

routes:
  get-user:
    gateway: api-test
    kind: http
    method: GET
	sync: true
    path: "/api/user"
    function: fetcher
```

This is a simple topology which creates a HTTP route backed by a function. In AWS, this creates the API Gateway configuration and creates the lambda function with the right permissions.


## 2. Request-async-Response

```yaml
name: 06-request-async-response

routes:
  post-message:
    gateway: api-test
    kind: http
    timeout: 10
    method: POST
    path: "/api/message"
    function: processor
  get-messages:
    gateway: api-test
    kind: http
    method: GET
    path: "/api/messages"
    function: fetcher

events:
  consumes:
    GetMessages:
      producer: fetcher
      channel: messages

channels:
  messages:
    on_publish:
      handler: default
```

## 3. Request-Queue

## 4. Request-Event-Routing

## 5. Events Choreography

## 6. Event Filters

## 7. Request Stepfunction

## 8. Request Map
