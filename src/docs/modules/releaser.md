# Releaser

<!-- toc -->

## Workflow


## Versioning

tc provides a sophisticated releaser module that can version at any level in the topology tree. Instead of managing the versions of each function, route, flow etc, we create a release tag at the top-level

```
tc tag --service <namespace> --next minor|major
```

This creates a tag with the etl prefix.


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
