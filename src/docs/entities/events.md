# Events

<!-- toc -->

topology.yml

```yaml
name: TOPOLOGY

events:
  EventName:
    producer: default
    filter: filter-expression
    function: function1
    functions:
      - function14
      - function2
    state:
      - stepfunction1
    channel:
      - room1
```

## Filters

```yaml
events:
  MyRawEvent:
    filter: '{"detail_type": ["FooBar"]}'
    function: '{{namespace}}_foo_{{sandbox}}'
  MyFilterEvent:
    producer: default
    filter: '{"metadata": {"type": ["foo"]}}'
    function: '{{namespace}}_foo_{{sandbox}}'
  MyAbstractEvent:
    producer: default
    function: '{{namespace}}_foo_{{sandbox}}'

```

## Pre-defined Producers

The value of `producer` is an arbitrary string or pre-defined trigger

```yaml
events:
  MyEvent:
    producer: S3/PUT_OBJECT
    filter: '{"key": "foo/bar.png"}'
    function: function1
```

The following are available triggers for AWS provider

| Resource | Trigger                        | Description |
|----------|--------------------------------|-------------|
| Cognito  | PRE_SIGNUP                     |             |
| Cognito  | POST_CONFIRMATION              |             |
| Cognito  | PRE_AUTHENTICATION             |             |
| Cognito  | POST_AUTHENTICATION            |             |
| Cognito  | CREATE_AUTH_CHALLENGE          |             |
| Cognito  | VERIFY_AUTH_CHALLENGE_RESPONSE |             |
| S3       | PUT_OBJECT                     |             |
| S3       | DELETE_OBJECT                  |             |
| DYNAMODB | PUT_ITEM                       |             |


## Composition

Events can be _composed_ with other entities. For example:

```yaml

routes:
  /api/foo:
    event: ApiEvent

events:
  ApiEvent:
    function: function1

```
## Visualization

To generate a visual flow:

```sh
tc compile -c events -f digraph | dot
```
