---
title: States
description: States Entity Reference
---

State transitions can be defined using the Amazon States Language and executed as Step functions. ASL is noisy as it gets and has quite a bit of boilerplate. tc tries to define flows between functions without needing ASL.

For example, let's consider the ETL example in ASL.


```yaml
name: state-linear

flow:
  Comment: ETL
  startAt: initialize
  TimeoutSeconds: 600
  States:
    initialize:
      Type: Task
      Resource: arn:aws:states:::lambda:invoke
      OutputPath: $.Payload
      Parameters:
        FunctionName: '{{namespace}}_initializer_{{sandbox}}'
        Payload:
          data.$: $
      Next: enhance
    enhance:
      Type: Task
      Resource: arn:aws:states:::lambda:invoke
      OutputPath: $.Payload
      Parameters:
        FunctionName: '{{namespace}}_enhancer_{{sandbox}}'
        Payload:
          data.$: $
      Next: transform
    transform:
      Type: Task
      Resource: arn:aws:states:::lambda:invoke
      OutputPath: $.Payload
      Parameters:
        FunctionName: '{{namespace}}_transformer_{{sandbox}}'
        Payload:
          data.$: $
      Next: load
    load:
      Type: Task
      Resource: arn:aws:states:::lambda:invoke
      OutputPath: $.Payload
      Parameters:
        FunctionName: '{{namespace}}_loader_{{sandbox}}'
        Payload:
          data.$: $
      End: true
```

Alternatively, the following topology is equivalent to the above:

```yaml

name: etl

functions:
  enhancer:
    root: true
    function: transformer
  transformer:
    function: loader
  loader:
    event: Notify

```
