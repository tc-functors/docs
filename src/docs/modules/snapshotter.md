# Snapshotter


The snapshotter module takes a snapshot of a given sandbox and outputs the same datastructure as the compiler output. This `isomorphic` characteristic is useful to see the diffs between sandboxes.

For example the following outputs a JSON with the topology structure

```sh

cd topology-dir
tc snapshot -s stable -e qa -c topology
```

```json

{
  "events": {},
  "functions": {
    "n_f_stable": {
      "code_size": "100 KB",
      "layers": {},
      "mem": 1024,
      "name": "n_f_stable",
      "revision": "e568c2865203",
      "tc_version": "0.8.71",
      "timeout": 180,
      "updated": "06:05:2025-15:48:32"
    },
...
```

### Versions


To see versions of all root topologies in a given sandbox:

```sh

tc snapshot -s stable -e qa -f table|json
```

```
tc snapshot -s stable -e qa  -f table
```

```pre
 namespace  | sandbox | version  | frozen | tc_version | updated_at
------------+---------+----------+--------+------------+---------------------
 node1      | stable  | 0.0.6    |        | 0.0.3      | 04:09:2025-18:20:42
 node2      | stable  | 0.0.14   |        | 0.0.3      | 04:09:2025-18:19:15
 node3      | stable  | 0.0.15   |        | 0.0.3      | 04:09:2025-18:19:28
 node11     | stable  | 0.0.15   |        | 0.0.3      | 04:09:2025-18:19:28
 node12     | stable  | 0.0.2    |        | 0.6.262    | 12:13:2024-06:46:57
```


To see versions across profiles for a sandbox, provide a csv of profiles/envs:

```sh
tc snapshot -s stable -e qa,staging
```

```
 Topology   | qa       | staging
------------+----------+----------
 node2      | 0.0.27   | 0.0.24
 node3      | 0.0.6    | 0.0.6
 node4      | 0.0.15   | 0.0.15
 node5      | 0.0.26   | 0.0.26
 node7      | 0.12.125 | 0.12.125
 node8      | 0.2.29   | 0.2.29
 node9      | 0.2.102  | 0.2.102
 node10     | 0.1.24   | 0.1.24
 node12     | 0.0.147  | 0.0.143
```

## Generating Manifest

tc generates true manifests that can be used to render it in any other sandbox preserving the versions of the entities (functions, routes, events etc). The structure of a manifest is a JSON map with the following fields:

```json
{
  "NAMESPACE": {
    "time": UTC_DATETIME,
    "env": STRING,
    "sandbox": STRING,
    "version": STRING,
    "changelog": ["list of changes in git for the given version"],
    "topology": TEMPLATED_TOPOLOGY
}
```

To generate manifests for all _deployed_ root topologies

```sh
tc snapshot -s stable -e qa --manifest

```

We can save it to a S3 bucket by specifying bucket and prefix

```sh
tc snapshot -s stable -e qa --manifest --save s3://bucket/yyyy/mm/dd/version.json
```

The manifest itself is a deployable definition.

```sh
tc create -s stable -e staging --manifest s3://bucket/yyyy/mm/dd/version.json
```
