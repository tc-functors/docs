# Queues

<!-- toc -->

## 1. Queue to function

```yaml

name: TOPOLOGY-NAME

queues:
  queue1:
    function: function1
```

By default, tc uses `sqs` as the queue.

## 2. Dead-letter queue

```yaml
queues:
  my-dlq:
    function: dlq-handler

functions:
  my-fn:
    queue: my-dlq

```

## 3. Composition
