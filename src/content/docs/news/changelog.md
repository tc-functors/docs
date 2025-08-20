---
title: Changelog
description: Tc changelog
---

### 0.8.118

- Adds `interactive` modes to `tc update` and`tc test`. Interactive mode provides a richer experience to update and test sandboxes incrementally.
- Defaults to function.yml instead of function.json for function specs.
- Adds `tc invoke` for routes (without auth)


### 0.8.115

08-18-2025

- Introducing tc test framework. It's a simple mechanism to define unit tests that test the entire topology or entities (functions, routes, events, mutations, states etc) synchronously. For example:
```
tests:
  test1:
    entity: functions/foo
    payload: '{"foo": "bar"}'
    condition: includes
    expect: '{"status": "ok"}'

  test2:
    entity:  routes/ping
    payload: '{"foo": "bar"}'
    condition: $.message
    expect: '{"a": 1}'
```
`payload` can be inline JSON, S3/HTTP URI or local json files. condition is JsonPath  or s-expressions. Read more about this here   https://tc-functors.org/reference/test/.
examples: https://github.com/tc-functors/tc/tree/main/examples/tests


- `tc create/update` automatically builds concurrently.

### 0.8.114

08-14-2025

- Adds `tc compose -c versions -f table|json` to get all the current versions of topologies in git.  (see screenshot)
- Adds `tc compose -c stats`  to get stats of topologies
- `TC_INSPECT_BUILD=1 tc build` now retains the build directory for inspecting. build also fails early if the size constraints are not met.

### 0.8.108

08-13-2025

- Adds state attribute to `EventSpec`.
- `producer` in `EventSpec` (or producers) key can now take multiple event sources.

### 0.8.106

08-13-2025

- Introducing `tc scaffold` It's an interactive scaffolder to set up base functions and other entities.
- `tc invoke` now can invoke arbitrary entities. For example:
```
tc invoke -s sandbox -e qa -c events/EVENTNAME -p payload.json
```
- tc invoke also takes in payload via uris (http or s3). The advantage is that we can have a set of payloads in S3 that we can use to test in CI/dev and not check it in git. So we can do something like this:
```
tc invoke -s sandbox -e qa --payload s3://bucket/key.json
```
- `tc invoke` also has an interactive REPL now. While this is still being worked on, the idea is to have an interactive stepper for all entities in the topology.
