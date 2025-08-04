---
title: Release
description: Release Workflow
---

The following flowchart and release workflow is perhaps opinionated. However, it is primarily to demonstrate how `tc` can be used at every stage in the development and release workflow, regardless of the CI/CD system that you may use.

[![Release image]][Release source]

[Release image]: ../../../assets/release-workflow.png
[Release source]: ../../../assets/release-workflow.png


Legends:
- White boxes imply manually executed commands
- Colored boxes imply that it could be run via CI

## Flow

Let's go through the flow.

1. Devs create PR and we can use `tc`'s test framework to do some basic tests. The tests run in the parent topology directory, recursively. This ensures that the entire topology is tested if `recursive` option is set.

2. On PR merge, we can create a test sandbox and invoke the entire topology. `invoke` command also takes in a paylod param. When the tests pass, we can bump the patch part of the semver tag associated with this topology. We can then do a continuous deploy to QA.

3. The above 2 steps could happen several times during a release/sprint cycle. Let's say at the end of the cycle, 0.1.29 version of the topology is good release candidate.

4. `Release`, in this context, semantically means that a certain tag or version can now be released for integration, regression and QA testing. It also implies that we bump the _minor_ part of the semver. The `release tag` is an `annotation tag` in git and not a `commit tag`. Annotation tags are just pointers. Therefore release tags can be unwound anytime.

5. We now deploy the above `annotation tag` of the topology (say 0.2.0) to QA sandbox (typically `stable` sandbox is the name used to denote that the changes deployed are stable and ready for testing. You can use any name for the sandbox). Once deployed, we `freeze` this sandbox. Freezing is a mechanism in which tc disallows any updates to it if enabled (frozen). Note that the entire system of topologies is frozen and not just the one deployed. This so the system can be tested in its entireity.

6. When the sandbox is frozen, we can run tests and ensure the changes across all the topologies are compatible. This goes through a cycle of bug fixes, updates and so forth.

7. When the frozen sandbox is ascertained to be stable, we `snapshot` it. Snapshotting is a mechanism in which we generate the entire manifest (with all the entity/component versions). This manifest or snapshot is self-contained and can be rendered in any sandbox.

8. We now use that snapshot to create a sandbox in production without updating the existing sandbox. Typically, this sandbox can be the name of the snapshot version which represents an unified version for the entire system.

9. Finally, when the new sandbox is up, we can route the traffic to this new sandbox using tc's routing mechanism. tc figures out the root of the topology (typically API routes or events) and points them to the new sandbox. We can also specify header-based filters to split traffic dynamically between old and new sandboxes.

## Changelog

To see the changelog of a specific topology

```
cd topology-dir
tc-releaser changelog

AI-123 Another command
AI-456 Thing got added

# or

tc-releaser changelog --between 0.8.1..0.8.6
```

To search for a specific text in all changelogs

```
cd root-topology-dir
tc-releaser changelog --search AI-1234

=> topology-name, version

```
