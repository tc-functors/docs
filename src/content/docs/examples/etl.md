---
title: ETL
description: Example - Enhance, Transform and Load
---

:::caution
This is a rough working draft
:::

The goal of this example is to introduce you to defining and composing entities without leaking any infrastructure details into it.

## Preamble

In this example, we will attempt to build the world's best ETL system. Just kidding! It's far from it.


We will try to design a simple serverless ETL system that has the following features:

1. An API to trigger the pipeline asynchronously.
2. Queue any requests and process them as FIFO
3. The pipeline has 3 functions - Enhancer, Transformer and Loader.
4. Notify on completion of the ETL process
5. Host a simple html page to show the notifications.


## Composition

If you were to ask an architect or Chat GPT, we may get an architecture something like this:

[![Etl image]][Etl source]

[Etl image]: ../../../assets/etl.png
[Etl source]: ../../../assets/etl.png

Can we define this topology at a high-level without knowing anything about the underlying services ? It's possible with `tc`.
Let's break it down and incrementally design the topology:

### Step 1 - Async API

```yaml  title="topology.yml"
name: etl

routes:
  /api/etl:
    method: POST
    async: true
    function: enhancer
```

The `enhancer` function implementation is irrelevant for the sake of this example. It could be written in Ruby, Python, Clojure or Rust. Let's assume there is a function directory called `enhancer` with some piece of code.

Let's create a sandbox called `yoda` with `dev` AWS_PROFILE.

```sh
tc create -s yoda -e dev
```

### Step 2 - Queue Requests


```yaml title="topology.yml"
name: etl

routes:
  /api/etl:
    method: POST
    queue: ETLQueue

queues:
  ETLQueue:
    function: enhancer
```

Queue may not be strictly necessary. However, in this context, the requirement is to preserve the order of requests. By default, `tc` configures a FIFO queue.

Now update our `yoda` sandbox

```sh
tc update -s yoda -e dev
```

### Step 3 - DAG of functions

```yaml title="topology.yml"
name: etl

routes:
  /api/etl:
    method: POST
    queue: ETLQueue

queues:
  ETLQueue:
    function: processor

functions:
  enhancer:
    root: true
    function: transformer
  transformer:
    function: loader


```

The enhancer, transformer and loader functions need not have any input/output transformation code. By specifying a DAG of functions above, tc composes and generates the ASL required for stepfunctions. We can inspect the generated ASL by running.

```sh
tc compose -s states -f yaml
```

```sh
tc update -s yoda -e dev
```


### Step 4 - Notification

```yaml title="topology.yml"

name: etl

routes:
  /api/etl:
    method: POST
    queue: ETLQueue

queues:
  ETLQueue:
    function: enhancer

functions:
  enhancer:
    root: true
    uri: ./enhancer
    function: transformer
  transformer:
    function: loader
    event: ProcessedMessage

events:
  ProcessedMessage:
    channel: etl-notifications

channels:
  etl-notifications:
    authorizer: default
```

The `loader` function emits an event `ProcessedMessage`. tc takes care of structuring the payload and using the right event pattern. Eventually, the event triggers a websocket notification via channels - Appsync event channel.


```sh
tc update -s yoda -e dev
```


### Step 5 - Webpage


```yaml title="topology.yml"
name: etl
routes:
  /api/etl:
    method: POST
    queue: ETLQueue

queues:
  ETLQueue:
    function: enhancer

functions:
  enhancer:
    root: true
    uri: ./enhancer
    function: transformer
  transformer:
    function: loader
    event: ProcessedMessage

events:
  ProcessedMessage:
    channel: etl-notifications

channels:
  etl-notifications:
    authorizer: default

pages:
  app:
    dist: .
    dir: webapp

```

Here we have it! With just few lines of abstract definition, we got an end-to-end ETL pipeline working with almost no infrastructure code.
