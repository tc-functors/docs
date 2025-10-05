---
title: CircleCI
description: CircleCI Integration
---

The following is an opinionated CircleCI workflow configuration for a monorepo comprising of several topologies.

```
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
  split-config: bufferings/split-config@0.1.0
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

  tc-release-minor:
    docker:
      - image: cimg/base:2025.08
    resource_class: small
    parameters:
      suffix:
        type: string
        default: "default"
      workdir:
        type: string
        default: "default"
      service:
        type: string
        default: "default"
    steps:
      - checkout
      - download-tc
      - run:
          name: "Release minor"
          working_directory: << parameters.workdir >>
          command: tc tag --next minor --service << parameters.service >> --suffix << parameters.suffix >> --push

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


  tc-deploy-branch:
    docker:
      - image: cimg/base:2025.08
    resource_class: large
    parameters:
      env:
        type: string
      sandbox:
        type: string
      branch:
        type: string
      workdir:
        type: string
        default: "default"
      opts:
        type: string
        default: "--notify"
    steps:
      - checkout
      - run: git fetch origin << parameters.branch >>
      - run: git checkout origin/<< parameters.branch >>
      - download-tc
      - setup_remote_docker
      - run:
          name: "Deploy branch"
          working_directory: << parameters.workdir >>
          command: tc create -e << parameters.env >> --sandbox << parameters.sandbox >> << parameters.opts >>

  tc-create-from-dir:
    docker:
      - image: cimg/base:2025.08
    resource_class: large
    parameters:
      env:
        type: string
      sandbox:
        type: string
      branch:
        type: string
      workdir:
        type: string
        default: "default"
      opts:
        type: string
        default: "--notify"
    steps:
      - checkout
      - run: git fetch origin << parameters.branch >>
      - run: git checkout origin/<< parameters.branch >>
      - download-tc
      - setup_remote_docker
      - run:
          name: "Create from dir"
          working_directory: << parameters.workdir >>
          command: tc create -e << parameters.env >> --sandbox << parameters.sandbox >> << parameters.opts >>

```

To trigger these pipeline jobs, set CIRCLE_CI_TOKEN env variable

```
export CIRCLE_CI_TOKEN=xyz
export TC_CI_PROVIDER=circleci
```
