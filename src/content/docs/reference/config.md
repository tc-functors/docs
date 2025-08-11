---
title: Configuration
description: Topology Configuration
---

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
