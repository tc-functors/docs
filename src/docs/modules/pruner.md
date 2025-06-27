# Pruner

<!-- toc -->

While `tc delete -s sandbox -e env` command deletes the given topology, there are times where we need to just nuke all resources associated with the sandbox.

To delete all the resources, do:

```sh
tc prune -e qa -s john
Found functions:131, states:31, mutations:2, routes:5, events:10
Do you want to delete these resources in given sandbox ? (y/n) y
...
```
