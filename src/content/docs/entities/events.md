---
title: Events
description: Events Entity Reference
---

## Spec

topology.yml
```yaml
name: TOPOLOGY

events:
  EventName:
    producer: String or Array
    producers: Array
    filter: <filter-expression>
    pattern: <JSON Event Pattern>
    function: <function1>
    functions:
      - <function1>
      - <function2>
    mutation: <mutationName>
    state: <state-or-stepfn-fqn>
    channel: <room1>
    rule_name: <static-rule-name>
    doc_only: <bool>
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
tc compiles JSON path filters to rules.

## Patterns

If we have more complex patterns that can't fit into basic producer/filter keys, we can specify a JSON blob containing the pattern

```yaml
events:
  MyEvent:
    pattern: '{"detail-type": ["foo"], "source": ["aws.s3"]}'
    function: foo
```

## Triggers

### Pre-defined Triggers

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


### Schedules

## Schedules

A schedule is a special kind of event. However, due to it's complexity and fixed payload configuration, they are defined in a separate file. For example, in `{INFRA_DIR}/<topology-name>/schedules.json

```json
{
  "run-task1": {
    "cron": "10 20 ? * SAT *",
    "target": "arn:aws:states:{{region}}:{{account}}:stateMachine:s1",
    "payload": {
      "account": "{{account}}",
      "region": "{{region}}",
      "target": "nightly",
      "job_id": "nightly",
      "task_name": "task1"
    }
  },
  "run-task2": {
    "cron": "20 20 ? * SAT *",
    "target": "arn:aws:states:{{region}}:{{account}}:function:f1",
    "payload": {
      "account": "{{account}}",
      "region": "{{region}}",
      "target": "nightly",
      "job_id": "nightly",
      "task_name": "task2"
    }
  }
}
```

To update just the schedules

```
tc update -s sandbox -e profile -c schedules
```

## Composition

Events can be _composed_ with other entities. For example:

```yaml

events:
  ApiEvent:
    function: function1

events:
  StateEvent:
    state: state-fqn
  MyOtherStateEvent:
	state: '{{namespace}}_{{sandbox}}'
```

## Invoke

To invoke an event with just the payload data ($.detail), do:

```
tc invoke -s SANDBOX -e PROFILE -c events/MyEvent -p payload.json
# or from s3
tc invoke -s SANDBOX -e PROFILE -c events/MyEvent -p s3://bucket/payload.json
```
