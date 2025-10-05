---
title: CircleCI
description: CircleCI Integration
---

## Global Configuration

The following is an opinionated CircleCI workflow configuration for a monorepo comprising of several topologies.

```sh title="circleci/config.yml"
version: 2.1

setup: true

parameters:
  tc-deploy-service:
    type: string
    default: default
  tc-deploy-version:
    type: string
    default: 0.0.0
  tc-deploy-env:
    type: string
    default: dev
  tc-deploy-sandbox:
    type: string
    default: main

orbs:
  path-filtering: circleci/path-filtering@0.1.1
  continuation: circleci/continuation@2.0.1

commands:
  download-tc:
    steps:
      - run:
          name: "Download tc executable"
          command: |
            curl -L -H "Accept: application/octet-stream"  -H "x-github-api-version: 2022-11-28" https://api.github.com/repos/tc-functors/tc/releases/assets/$TC_RELEASE_ID -o tc && chmod +x tc
            sudo mv tc /usr/local/bin/tc


jobs:
  tc-test:
    docker:
      - image: cimg/base:2025.08
    resource_class: small
    parallelism: 4
    parameters:
      env:
        type: string
      sandbox:
        type: string
      opts:
        type: string
        default: ""
      workdir:
        type: string
        default: "default"
    steps:
      - checkout
      - download-tc
      - run:
          name: "Run topology unit tests"
          working_directory: << parameters.workdir >>
          command: tc test -s << parameters.sandbox >> -e << parameters.env >> -r

  tc-release-patch:
    docker:
      - image: cimg/base:2025.08
    resource_class: small
    parameters:
      workdir:
        type: string
      service:
        type: string
    steps:
      - checkout
      - download-tc
      - run:
          name: "Release patch"
          working_directory: << parameters.workdir >>
          command: |
            git fetch --tags && tc tag --next patch --service << parameters.service >> --push

  tc-deploy:
    docker:
      - image: cimg/base:2025.08
    resource_class: medium
    parameters:
      env:
        type: string
      sandbox:
        type: string
      opts:
        type: string
        default: ""
      workdir:
        type: string
    steps:
      - checkout
      - download-tc
      - setup_remote_docker
      - run:
          name: "Continuous deploy"
          working_directory: << parameters.workdir >>
          command: tc create -e << parameters.env >> --sandbox << parameters.sandbox >> << parameters.opts >>

  tc-deploy-tag:
    docker:
      - image: cimg/base:2025.08
    resource_class: medium
    parameters:
      env:
        type: string
      sandbox:
        type: string
      tag:
        type: string
      workdir:
        type: string
        default: "default"
      opts:
        type: string
        default: "--notify"
    steps:
      - checkout
      - download-tc
      - run: git fetch origin << parameters.tag >>
      - run: git checkout << parameters.tag >>
      - setup_remote_docker
      - run:
          name: "Deploy tag"
          working_directory: << parameters.workdir >>
          command: tc create -e << parameters.env >> --sandbox << parameters.sandbox >> << parameters.opts >>

workflows:
  setup-config:
    jobs:
    - path-filtering/filter:
        name: check-updated-files
        workspace_path: /tmp
        config-path: /tmp/generated_config.yml
        mapping: |-
          topologies/topo-1/.* run-topo-1 true
          topologies/topo-2/.* run-topo-2 true
```

In the above workflow in the top-level `.circleci/config.yml`, we define the path filtering rules to trigger the corresponding .circleci config (say topologies/topo-1/.circleci/config.yml)

## Workflows

With the above 4 jobs (`tc-test`, `tc-release-patch`, `tc-deploy`, `tc-deploy-tag`), we can define sophisticated workflows in each of the topology ci configs:

### Run tests on PR create

```
workflows:
  topo1-PR:
    when:
      and:
        - equal: [true, << pipeline.parameters.run-topo-1 >>]
        - not:
            equal: [topo-1, << pipeline.parameters.tc-release-service >>]
        - not:
            equal: [topo-1, << pipeline.parameters.tc-deploy-service >>]
        - equal: [false, << pipeline.parameters.api_call>>]
        - not:
            equal: [api, << pipeline.trigger_source >> ]
        - not:
            equal: [main, << pipeline.git.branch >>]
    jobs:
      - tc-deploy:
          name: sid-update
          workdir: topologies/classification
          sandbox: sid
          env: dev
          opts: "--recursive --trace"
          context:
            - tc
            - aws-user-creds
      - tc-test:
          name: sid-unit-tests
          workdir: topologies/topo-1
          sandbox: sid
          env: qa
          requires:
            - sid-update
          context:
            - tc
            - aws-user-creds
```

### Create tag on PR merge

```yaml title="topo-1/.circleci/config.yml"
workflows:
  code-merged:
    when:
      and:
        - equal: [true, << pipeline.parameters.run-topo-1 >>]
        - not:
            equal: [topo-1, << pipeline.parameters.tc-release-service >>]
        - not:
            equal: [topo-1, << pipeline.parameters.tc-deploy-service >>]
        - equal: [false, << pipeline.parameters.api_call >>]
        - not:
            equal: [api, << pipeline.trigger_source >> ]
        - equal: [main, << pipeline.git.branch >>]
    jobs:

      - tc-release-patch:
          name: release-patch
          workdir: topology/topo-1
          service: my-topo1
          context: tc
```

### Create sandbox with arbitrary tag

```yaml title="topo-1/.circleci/config.yml"
  topo-1-deploy:
    when:
      and:
        - equal: [topo-1, << pipeline.parameters.tc-deploy-service >>]
        - equal: [api, << pipeline.trigger_source >> ]
        - equal: [true, << pipeline.parameters.api_call >>]
        - equal: [main, << pipeline.git.branch >> ]
    jobs:
      - tc-deploy-tag:
          name: deploy-tag
          workdir: topologies/topo-1
          env: << pipeline.parameters.tc-deploy-env >>
          sandbox: << pipeline.parameters.tc-deploy-sandbox >>
          tag: topo-1-<< pipeline.parameters.tc-deploy-version >>
          context:
            - tc
            - cicd-aws-user-creds
```

To trigger these pipeline jobs, set CIRCLE_CI_TOKEN env variable
```
export CIRCLE_CI_TOKEN=xyz
export TC_CI_PROVIDER=circleci
```
```sh
tc ci-deploy --topology topo-1 --version 0.x.y --env <profile> --sandbox <sandbox>
```
