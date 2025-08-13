---
title: Env
description: Reference - Environment variables
---

`tc` uses special environment variables as feature bits and config overrides. The following is the list of TC environment variables:

## General overrides

#### TC_DIR

We don't have to always be in the topology or function directory to run a contextual tc command. TC_DIR env var sets the directory context

```
TC_DIR=/path/to/services/fubar tc create -s sandbox -e env
```

#### TC_CONFIG_PATH

Path to TC config file. This config file is optional and has infrastructure overrides.


#### TC_SANDBOX

Set this to have a fixed sandbox name for all your sandboxes

```
TC_SANDBOX=my-branch tc create -e env
```

#### TC_TRACE

Set tracing level. This overrides --trace flag

```
TC_TRACE=1 tc create -e env
TC_TRACE=2 tc build ..
```

#### TC_ASSUME_ROLE

In cases, where we don't have AWS profiles or Environment provider, we can _assume_ role - typically useful in CI environments

```
TC_ASSUME_ROLE=my-iam-role tc create..
```

## Build-specific variables


#### TC_FORCE_BUILD

Tries various fallback strategies to build layers. One of the strategies is to build locally instead of a docker container. Another fallback is to use a specific version of python even if the transitive dependencies need specific version of Ruby or Python

```
TC_FORCE_BUILD=1 tc build --trace
```

#### TC_PARALLEL_BUILD

To parallelize builds particularly in recursive mode.

```
TC_PARALLEL_BUILD=1 tc build --recursive
```

#### TC_SKIP_BUILD

To skip Image or Inline builds and update just code, do:

```
TC_SKIP_BUILD=1 tc create ...
```

#### TC_INSPECT_BUILD

To inspect the temporary build artifact and directory, particularly in Image and Inline builds, do:

```
TC_INSPECT_BUILD=1 tc build

```

## Sandbox-specific variables

#### TC_FORCE_DEPLOY

To create, update, delete stable sandboxes (which are prohibited by default), use this var to override.

```
TC_FORCE_DEPLOY=1 tc create -s sandbox -e env
```

#### TC_FORCE_DELETE

To delete stable sandboxes (which are prohibited by default), use this var to override. `TC_FORCE_DEPLOY` also works but is deprecated.

```
TC_FORCE_DELETE=1 tc create -s sandbox -e env
```

#### TC_LEGACY_ROLES

To use `tc-base-*` static roles, set this variable explicitly. Enabling it will not use any dynamic permissions.

```
TC_LEGACY_ROLES=1 tc create -s sandbox -e env
```

#### TC_PAGES_BUCKET

Global override for S3 bucket to use for cloudfront distributions when creating pages entity.

```
export TC_PAGES_BUCKET=my-bucket-name
```

#### TC_USE_STABLE_LAYERS

At times we may need to use stable layers in non-stable sandboxes. This env variable allows us to use stable layers

```
TC_USE_STABLE_LAYERS=1 tc create -s sandbox -e env

```

#### TC_SFN_DEBUG

To enable tracing data in the stepfunction logs, set

```
TC_SFN_DEBUG=1 tc update -s sandbox -e env
```

#### TC_SFN_LOG_LEVEL

Set stepfunction log level dynamically

```
TC_SFN_LOG_LEVEL=debug tc update -s sandbox -e env
```

#### TC_PRUNE_EVENT_RULES

To remove stale rules that are not composed by tc

```
TC_PRUNE_EVENT_RULES=1 tc update -s sandbox -e env -c events
```

#### TC_ECR_REPO

The ECR Repo URI global override. Config: aws.ecr.repo

#### TC_SYNC_CREATE

tc, by default, concurrently creates the functions. To keep it more deterministic for debugging purposes:

```
TC_SYNC_CREATE=1 tc create ..

```

## Release variables

#### TC_UPDATE_METADATA

To update `deploy metadata` to a dynamodb table (the only stateful stuff in TC) for stable sandboxes

```
TC_UPDATE_METADATA=1 tc create -s staging -e env
```
