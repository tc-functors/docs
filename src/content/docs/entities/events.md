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

## Triggers

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

## Visualization

To generate a visual flow:

```sh
tc compile -c events -f digraph | dot
```
