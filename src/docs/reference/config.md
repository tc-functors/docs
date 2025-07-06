# Config Specification

The following is a sample config file that you can place in your infrastructure root (infrastructure/tc/) or the path in `TC_CONFIG_PATH`. The configs have sections specific to the module and are optional with sane defaults.


```yaml
compiler:
  verify: false
  graph_depth: 4
  default_infra_path: infrastructure/tc

resolver:
  incremental: false
  cache: false
  stable_sandbox: stable
  layer_promotions: true

deployer:
  guard_stable_updates: true
  rolling: false

builder:
  parallel: false
  autosplit: true
  max_package_size: 50000000
  ml_builder: true

aws:
  eventbridge:
    bus: EVENT_BUS
    rule_prefix: tc-
    default_role: tc-base-event-role
    default_region: us-west-2
    sandboxes: ["stable"]

  ecs:
    subnets: ["subnet-tag"]
    cluster: my-cluster

  stepfunction:
    default_role: tc-base-sfn-role
    default_region: us-west-2

  lambda:
    default_timeout: 180
    default_role: tc-base-lambda-role
    default_region: us-west-2
    layers_profile: LAYER_AWS_PROFILE
    fs_mountpoint: /mnt/assets

  api_gateway:
    api_name: GATEWAY_NAME
    default_region: us-west-2
```

### Environment variables

`tc` uses special environment variables as feature bits and config overrides. The following is the list of TC environment variables:

**TC_DIR**

We don't have to always be in the topology or function directory to run a contextual tc command. TC_DIR env var sets the directory context

```
TC_DIR=/path/to/services/fubar tc create -s sandbox -e env
```


**TC_USE_STABLE_LAYERS**

At times we may need to use stable layers in non-stable sandboxes. This env variable allows us to use stable layers

```
TC_USE_STABLE_LAYERS=1 tc create -s sandbox -e env
```

**TC_USE_SHARED_DEPS**

This feature flag uses common deps (in EFS) instead of function-specific deps.

```
TC_USE_SHARED_DEPS=1 tc create -s sandbox -e env
```

**TC_FORCE_BUILD**

Tries various fallback strategies to build layers. One of the strategies is to build locally instead of a docker container. Another fallback is to use a specific version of python even if the transitive dependencies need specific version of Ruby or Python

```
TC_FORCE_BUILD=1 tc build --trace
```

**TC_FORCE_DEPLOY**

To create or update stable sandboxes (which are prohibited by default), use this var to override.

```
TC_FORCE_DEPLOY=1 tc create -s sandbox -e env
```

**TC_UPDATE_METADATA**

To update `deploy metadata` to a dynamodb table (the only stateful stuff in TC) for stable sandboxes

```
TC_UPDATE_METADATA=1 tc create -s staging -e env
```

**TC_ECS_CLUSTER**

Use this to override the ECS Cluster name

```
TC_ECS_CLUSTER=my-cluster tc create -s sandbox -e env
```

**TC_USE_DEV_EFS**

Experimental EFS with deduped deps and models

```
TC_USE_DEV_EFS=1 tc create ...

```

**TC_SANDBOX**

Set this to have a fixed sandbox name for all your sandboxes

```
TC_SANDBOX=my-branch tc create -e env
```
