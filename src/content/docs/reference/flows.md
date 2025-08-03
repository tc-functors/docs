---
title: Flows
description: Topology Flows
---


```admonish info
```

## ASL generation

tc generates Amazon States Language (ASL) using just simple constructs for basic flows. For example:

```yaml
name: etl

functions:
  enhancer:
    root: true
    function: transformer
  transformer:
    function: loader
  loader:
	end: true
```

WIP: documemntation
