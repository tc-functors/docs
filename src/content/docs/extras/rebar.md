---
title: Rebar
description: Remote Build Server
---

`Rebar` is a standalone build server that can be optionally used to build images.


### Running Locally

We can run it locally to test:

```sh
./rebar --port 9000
```

The following command (tc build) will send a build request to rebar and wait until it completes. `--remote` takes http url, ECS fargate ARN


```sh
tc build --remote http://localhost:9000
```

### Running as Fargate container

```
cd tc-functors/rebar
tc create -s SANDBOX -e AWS_PROFILE
=> fargate-task-arn
```

```sh
tc build --remote fargate-task-arn
```
