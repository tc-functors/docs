---
title: CLI
description: CLI Reference
---

This document contains the help content for the `tc` command-line program.

**Command Overview:**

* [`tc`↴](#tc)
* [`tc build`↴](#tc-build)
* [`tc compose`↴](#tc-compose)
* [`tc create`↴](#tc-create)
* [`tc delete`↴](#tc-delete)
* [`tc freeze`↴](#tc-freeze)
* [`tc invoke`↴](#tc-invoke)
* [`tc prune`↴](#tc-prune)
* [`tc resolve`↴](#tc-resolve)
* [`tc snapshot`↴](#tc-snapshot)
* [`tc test`↴](#tc-test)
* [`tc tag`↴](#tc-tag)
* [`tc unfreeze`↴](#tc-unfreeze)
* [`tc update`↴](#tc-update)
* [`tc upgrade`↴](#tc-upgrade)
* [`tc version`↴](#tc-version)

## `tc`

**Usage:** `tc <COMMAND>`

###### **Subcommands:**

* `build` — Build layers, extensions and pack function code
* `compose` — Compose a Topology
* `create` — Create a sandboxed topology
* `delete` — Delete a sandboxed topology
* `freeze` — Freeze a sandbox and make it immutable
* `invoke` — Invoke a topology synchronously or asynchronously
* `prune` — Prune all resources in given sandbox
* `resolve` — Resolve a topology
* `snapshot` — Snapshot of current sandbox and env
* `test` — Run tests in topology
* `tag` — Create semver tags scoped by a topology
* `unfreeze` — Unfreeze a sandbox and make it mutable
* `update` — Update entity and components
* `upgrade` — upgrade tc version
* `version` — display current tc version



## `tc build`

Build layers, extensions and pack function code

**Usage:** `tc build [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-n`, `--name <NAME>`
* `-k`, `--kind <KIND>`
* `-i`, `--image <IMAGE>`
* `-l`, `--layer <LAYER>`
* `-v`, `--version <VERSION>`
* `--clean`
* `-r`, `--recursive`
* `-t`, `--trace`
* `-p`, `--publish`
* `--promote`
* `--shell`
* `-s`, `--sync`
* `--parallel`
* `--remote`



## `tc compose`

Compose a Topology

**Usage:** `tc compose [OPTIONS]`

###### **Options:**

* `--versions`
* `-r`, `--recursive`
* `--root`
* `-c`, `--entity <ENTITY>`
* `-d`, `--dir <DIR>`
* `-f`, `--format <FORMAT>`
* `-t`, `--trace`



## `tc create`

Create a sandboxed topology

**Usage:** `tc create [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-T`, `--topology <TOPOLOGY>`
* `--notify`
* `-r`, `--recursive`
* `--cache`
* `-t`, `--trace`
* `-d`, `--dirty`



## `tc delete`

Delete a sandboxed topology

**Usage:** `tc delete [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--entity <ENTITY>`
* `-r`, `--recursive`
* `--cache`
* `-t`, `--trace`



## `tc freeze`

Freeze a sandbox and make it immutable

**Usage:** `tc freeze [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `-t`, `--trace`



## `tc invoke`

Invoke a topology synchronously or asynchronously

**Usage:** `tc invoke [OPTIONS]`

###### **Options:**

* `-p`, `--payload <PAYLOAD>`
* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-n`, `--name <NAME>`
* `-S`, `--step <STEP>`
* `-k`, `--kind <KIND>`
* `--local`
* `--dumb`
* `-t`, `--trace`



## `tc prune`

Prune all resources in given sandbox

**Usage:** `tc prune [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `-f`, `--filter <FILTER>`
* `--dry-run`
* `-t`, `--trace`



## `tc resolve`

Resolve a topology

**Usage:** `tc resolve [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--entity <ENTITY>`
* `-q`, `--quiet`
* `-r`, `--recursive`
* `--diff`
* `--cache`
* `-t`, `--trace`



## `tc snapshot`

Snapshot of current sandbox and env

**Usage:** `tc snapshot [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `-f`, `--format <FORMAT>`
* `-m`, `--manifest`
* `-S`, `--save <SAVE>`
* `--target-profile <TARGET_PROFILE>`



## `tc test`

Run tests in topology

**Usage:** `tc test [OPTIONS]`

###### **Options:**

* `-d`, `--dir <DIR>`
* `-l`, `--lang <LANG>`
* `--with-deps`
* `-t`, `--trace`



## `tc tag`

Create semver tags scoped by a topology

**Usage:** `tc tag [OPTIONS]`

###### **Options:**

* `-n`, `--next <NEXT>`
* `-s`, `--service <SERVICE>`
* `--dry-run`
* `--push`
* `--unwind`
* `-S`, `--suffix <SUFFIX>`
* `-t`, `--trace`



## `tc unfreeze`

Unfreeze a sandbox and make it mutable

**Usage:** `tc unfreeze [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `-t`, `--trace`



## `tc update`

Update entity and components

**Usage:** `tc update [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--entity <ENTITY>`
* `-a`, `--asset <ASSET>`
* `--notify`
* `-r`, `--recursive`
* `--cache`
* `-t`, `--trace`



## `tc upgrade`

upgrade tc version

**Usage:** `tc upgrade [OPTIONS]`

###### **Options:**

* `-v`, `--version <VERSION>`
* `-t`, `--trace`



## `tc version`

display current tc version

**Usage:** `tc version`
