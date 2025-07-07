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

## 2. Triggers

tc provides pre-defined triggers

```yaml
events:
  MyEvent:
    producer: S3/PUT_OBJECT
    filter: '{"key": "foo/bar.png"}'
    function: function1
```

The following are available triggers for AWS provider

| Resource | Trigger                        | Description      |
|----------|--------------------------------|------------------|
| Cognito  | PRE_SIGNUP                     |                  |
| Cognito  | POST_CONFIRMATION              |                  |
| Cognito  | PRE_AUTHENTICATION             |                  |
| Cognito  | POST_AUTHENTICATION            |                  |
| Cognito  | CREATE_AUTH_CHALLENGE          |                  |
| Cognito  | VERIFY_AUTH_CHALLENGE_RESPONSE |                  |
| S3       | PUT_OBJECT                     |                  |
| S3       | DELETE_OBJECT                  |                  |
| DYNAMODB | PUT_ITEM                       |                  |



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

WIP

## 5. Schedules

```
| Schedule | CRON                           |                  |
| Schedule | HOURLY                         |                  |
| Schedule | DAILY                          | Run midnight UTC |
| Schedule | EVERY_FIVE_MINS                |                  |
```

## 5. Compostion

Events can be _composed_ with other entities. For example:

```yaml

routes:
  /api/foo:
    event: ApiEvent

events:
  ApiEvent:
    function: function1

```
## 6. Visualization

To generate a visual flow:

```sh
tc compile -c events -f digraph | dot
```
