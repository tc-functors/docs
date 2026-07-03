---
title: Stores
description: Stores
---

:::note
Available in upcoming tc 0.10.x
:::

Store is an entity that abstracts the underlying store. It takes a key to read and key/value to write. Stores are best used with `nano` functions which are lightweight and have almost no IO or state. For example:

```yaml
name: example-stores

functions:
  f1:
    runtime: python3.12
    code: |
      import uuid

      def handler(event, context):
        return {'key': str(uuid.uuid4() + '.json', 'value': event)}
    store: s1

stores:
  s1:
    kind: S3
    bucket: my-bucket
    op: write
```

Here function `f1` writes to store `s1`. f1 only emits a key/value map that is persisted in the underlying store.
