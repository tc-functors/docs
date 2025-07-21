---
title: Workflow::Cleanup
description: Cleanup
---


## Pruning

tc does not use any external state to identify stale resources. However, it provides a command to prune all resources with a sandbox:


```sh
tc prune --sandbox SANDBOX -e ENV [--dry-run] [--filter filter]

Found

arn:aws:lambda:us-west-2:xxxx:function:xx_SANDBOX
arn:aws:lambda:us-west-2:xxxx:function:xx_SANDBOX
...

Found functions:3, states:1, mutations:0, routes:0, events:0

```
This command will identify all resources associated with the sandbox (suffix) without taking the topology into consideration. This is a reasonably effecient mechansim to GC all old resources.

The `--dry-run` flag lists the resources that need to be pruned without pruning them.

`--filter STRING` takes a regex (like Sed/AWK) and filters the resources matching the regex.
