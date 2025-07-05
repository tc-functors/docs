# Events

<!-- toc -->

## 1. Event to function mapping

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

## 2 Pre-defined Producers

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


## 3. Filters

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
tc compiles JSON path filters to rules


## 4. Schemas

## 5. Patterns

### 5.1 Event-driven choreography


## 6. Compostion

Events can be _composed_ with other entities. For example:

```yaml

routes:
  /api/foo:
    event: ApiEvent

events:
  ApiEvent:
    function: function1

```
## 7. Visualization

To generate a visual flow:

```sh
tc compile -c events -f digraph | dot
```
