---
title: Inspector
description: HTMX-based Inspector UI
---

The `inspector` is an in-built HTMX-based UI to inspect core tc entities in the filesystem. It also has an interface to generate topologies using LLM models specific to tc.

By default, `inspector` uses SurrealDB in-memory mode.


```sh
tc inspect --port 8080

=> http://localhost:8080
```

### Optional external database

Alternatively, we can run SurrealDB in network mode and connect to it.
Follow instructions to install SurrealDB -  https://surrealdb.com/install


```
surreal start --user root --pass secret

```
Add following to tc-inspector.yml file.

```yaml
store_mode: Network
address: 127.0.0.1:8000
user: root
password: secret
```

Run tc inspector with path to tc-inspector.yml file

```
cd tc/examples
tc inspect --port 8080 --config tc-inspector.yml
```

### LLM

The inspector has a simple interface to generate topologies using pre-trained tc examples and specifications.

![llm](../../../assets/inspector-llm.gif)

### Screenshots

![overview](../../../assets/inspector-overview.png)

![visual](../../../assets/inspector-visual.png)
