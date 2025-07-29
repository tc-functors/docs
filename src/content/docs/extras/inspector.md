---
title: Inspector
description: HTMX-based Inspector UI
---

The `inspector` is an external standalone application that provides a simple
HTMX-based web ui.

Download standalone executable from here https://github.com/tc-functors/inspector/releases

By default, `inspector` uses SurrealDB in-memory mode.


```sh
tc-inspector --port 8080

=> http://localhost:8080
```

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
tc-inspector --port 8080 --config tc-inspector.yml
```

[![Overview]][Overview]

[Overview]: ../../../assets/inspector-overview.png

[![Visual]][Visual]

[Visual]: ../../../assets/inspector-visual.png
