---
title: Release
description: Release Workflow
---

The following flowchart and release workflow is perhaps opinionated. However, it is primarily to demonstrate how `tc` can be used at every stage in the development and release workflow, regardless of the CI/CD system that you may use. There are typically 4 stages in a development, testing and deploy workflow:

### Stage 1 - Development

[![Stage1 image]][Stage1 source]

[Stage1 image]: ../../../assets/rel-stage1.png
[Stage1 source]: ../../../assets/rel-stage1.png



- Devs create PR and we can use `tc`'s test framework to do some basic tests. The tests run in the parent topology directory, recursively. This ensures that the entire topology is tested if `recursive` option is set.



### Stage 2 - Continuous Deploys

[![Stage2 image]][Stage2 source]

[Stage2 image]: ../../../assets/rel-stage2.png
[Stage2 source]: ../../../assets/rel-stage2.png


- On PR merge, we can create a test sandbox and invoke the entire topology. `invoke` command also takes in a paylod param. When the tests pass, we can bump the patch part of the semver tag associated with this topology. We can then do a continuous deploy to QA.

This stage could happen several times during a release/sprint cycle. Let's say at the end of the cycle, 0.1.29 version of the topology is good release candidate.


### Stage 3 - End-to-end Testing

[![Stage3 image]][Stage3 source]

[Stage3 image]: ../../../assets/rel-stage3.png
[Stage3 source]: ../../../assets/rel-stage3.png


- `Release`, in this context, semantically means that a certain tag or version can now be released for integration, regression and QA testing. It also implies that we bump the _minor_ part of the semver. The `release tag` is an `annotation tag` in git and not a `commit tag`. Annotation tags are just pointers. Therefore release tags can be unwound anytime.

- We now deploy the above `annotation tag` of the topology (say 0.2.0) to QA sandbox (typically `stable` sandbox is the name used to denote that the changes deployed are stable and ready for testing. You can use any name for the sandbox). Once deployed, we `freeze` this sandbox. Freezing is a mechanism in which tc disallows any updates to it if enabled (frozen). Note that the entire system of topologies is frozen and not just the one deployed. This so the system can be tested in its entireity.

- When the sandbox is frozen, we can run tests and ensure the changes across all the topologies are compatible. This goes through a cycle of bug fixes, updates and so forth.

- When the frozen sandbox is ascertained to be stable, we `snapshot` it. Snapshotting is a mechanism in which we generate the entire manifest (with all the entity/component versions). This manifest or snapshot is self-contained and can be rendered in any sandbox. `tc snapshot` provides S3, surrealdb and dynamodb as backend stores to store the entire graph (manifest).


### Stage 4 - Canary deploys

[![Stage4 image]][Stage4 source]

[Stage4 image]: ../../../assets/rel-stage4.png
[Stage4 source]: ../../../assets/rel-stage4.png


- We now use that snapshot to create a sandbox in production without updating the existing sandbox. Typically, this sandbox can be the name of the snapshot version which represents an unified version for the entire system.

- Finally, when the new sandbox is up, we can route the traffic to this new sandbox using tc's routing mechanism. tc figures out the root of the topology (typically API routes or events) and points them to the new sandbox. We can also specify header-based filters to split traffic dynamically between old and new sandboxes.



Putting it all together in a compact flow diagram:

[![Release image]][Release source]

[Release image]: ../../../assets/release-workflow.png
[Release source]: ../../../assets/release-workflow.png


## Changelog

To see the changelog of a specific topology

```
cd topology-dir
tc changelog

AI-123 Another command
AI-456 Thing got added

# or

tc changelog --between 0.8.1..0.8.6
```

To search for a specific text in all changelogs

```
cd root-topology-dir
tc changelog --search AI-1234

=> topology-name, version

```

## Notifications

All tc sandbox commands (create, update, delete, freeze, unfreeze, tag) have notification hooks. For slack notifications, we can specify `TC_SLACK_URL` env variable with the Slack webhook. Alternatively, if you need per-topology slack hooks, you could set a map of topology name and their webhook urls in `TC_CONFIG` (see Reference -> Configuration)
