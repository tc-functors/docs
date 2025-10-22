---
title: Chat
description: Serverless Chat
---

This example shows a simple chat application using channels.

```
name: example-chat

channels:
  my-channel:
    handler: default

pages:
  app:
    bucket: some-s3-bucket-name
    dir: .
    dist: dist
    config_template: index.html
```

This is all there is to it.

```
tc create -s yoda --profile PROFILE
```

![Chat1](../../../assets/chat.gif)

See index.html for using raw Websockets to connect to channels. tc renders all the required hosts and identities in the provided config_template (index.html).
