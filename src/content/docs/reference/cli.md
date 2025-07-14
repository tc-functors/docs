---
title: CLI
description: Topology Composer
---


This document contains the help content for the `tc` command-line program.

**Command Overview:**

* [`tc`↴](#tc)
* [`tc bootstrap`↴](#tc-bootstrap)
* [`tc build`↴](#tc-build)
* [`tc cache`↴](#tc-cache)
* [`tc compile`↴](#tc-compile)
* [`tc config`↴](#tc-config)
* [`tc create`↴](#tc-create)
* [`tc delete`↴](#tc-delete)
* [`tc freeze`↴](#tc-freeze)
* [`tc emulate`↴](#tc-emulate)
* [`tc inspect`↴](#tc-inspect)
* [`tc invoke`↴](#tc-invoke)
* [`tc list`↴](#tc-list)
* [`tc publish`↴](#tc-publish)
* [`tc resolve`↴](#tc-resolve)
* [`tc route`↴](#tc-route)
* [`tc scaffold`↴](#tc-scaffold)
* [`tc test`↴](#tc-test)
* [`tc tag`↴](#tc-tag)
* [`tc unfreeze`↴](#tc-unfreeze)
* [`tc update`↴](#tc-update)
* [`tc upgrade`↴](#tc-upgrade)
* [`tc version`↴](#tc-version)
* [`tc doc`↴](#tc-doc)

## `tc`

**Usage:** `tc <COMMAND>`

###### **Subcommands:**

* `bootstrap` — Bootstrap IAM roles, extensions etc
* `build` — Build layers, extensions and pack function code
* `cache` — List or clear resolver cache
* `compile` — Compile a Topology
* `config` — Show config
* `create` — Create a sandboxed topology
* `delete` — Delete a sandboxed topology
* `freeze` — Freeze a sandbox and make it immutable
* `emulate` — Emulate Runtime environments
* `inspect` — Inspect via browser
* `invoke` — Invoke a topology synchronously or asynchronously
* `list` — List created entities
* `publish` — Publish layers
* `resolve` — Resolve a topology from functions, events, states description
* `route` — Route events to functors
* `scaffold` — Scaffold roles and infra vars
* `test` — Run unit tests for functions in the topology dir
* `tag` — Create semver tags scoped by a topology
* `unfreeze` — Unfreeze a sandbox and make it mutable
* `update` — Update components
* `upgrade` — upgrade tc version
* `version` — display current tc version
* `doc` — Generate documentation



## `tc bootstrap`

Bootstrap IAM roles, extensions etc

**Usage:** `tc bootstrap [OPTIONS]`

###### **Options:**

* `-R`, `--role <ROLE>`
* `-e`, `--profile <PROFILE>`
* `--create`
* `--delete`
* `--show`
* `-t`, `--trace`



## `tc build`

Build layers, extensions and pack function code

**Usage:** `tc build [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-k`, `--kind <KIND>`
* `-n`, `--name <NAME>`
* `-i`, `--image <IMAGE>`
* `--clean`
* `-r`, `--recursive`
* `--dirty`
* `--merge`
* `--split`
* `--task <TASK>`
* `-t`, `--trace`
* `-p`, `--publish`



## `tc cache`

List or clear resolver cache

**Usage:** `tc cache [OPTIONS]`

###### **Options:**

* `--clear`
* `--list`
* `-n`, `--namespace <NAMESPACE>`
* `-e`, `--env <ENV>`
* `-s`, `--sandbox <SANDBOX>`
* `-t`, `--trace`



## `tc compile`

Compile a Topology

**Usage:** `tc compile [OPTIONS]`

###### **Options:**

* `--versions`
* `-r`, `--recursive`
* `-c`, `--component <COMPONENT>`
* `-f`, `--format <FORMAT>`
* `-t`, `--trace`



## `tc config`

Show config

**Usage:** `tc config`



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
* `--no-cache`
* `-t`, `--trace`



## `tc delete`

Delete a sandboxed topology

**Usage:** `tc delete [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--component <COMPONENT>`
* `-r`, `--recursive`
* `--no-cache`
* `-t`, `--trace`



## `tc freeze`

Freeze a sandbox and make it immutable

**Usage:** `tc freeze [OPTIONS] --sandbox <SANDBOX>`

###### **Options:**

* `-d`, `--service <SERVICE>`
* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `--all`
* `-t`, `--trace`



## `tc emulate`

Emulate Runtime environments

**Usage:** `tc emulate [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-s`, `--shell`
* `-d`, `--dev`
* `-t`, `--trace`



## `tc inspect`

Inspect via browser

**Usage:** `tc inspect [OPTIONS]`

###### **Options:**

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



## `tc list`

List created entities

**Usage:** `tc list [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-r`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--component <COMPONENT>`
* `-f`, `--format <FORMAT>`
* `-t`, `--trace`



## `tc publish`

Publish layers

**Usage:** `tc publish [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-k`, `--kind <KIND>`
* `--name <NAME>`
* `--list`
* `--promote`
* `--demote`
* `--download`
* `--version <VERSION>`
* `--task <TASK>`
* `--target <TARGET>`
* `-t`, `--trace`



## `tc resolve`

Resolve a topology from functions, events, states description

**Usage:** `tc resolve [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--component <COMPONENT>`
* `-q`, `--quiet`
* `-r`, `--recursive`
* `--diff`
* `--no-cache`
* `-t`, `--trace`



## `tc route`

Route events to functors

**Usage:** `tc route [OPTIONS] --service <SERVICE>`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-E`, `--event <EVENT>`
* `-s`, `--sandbox <SANDBOX>`
* `-S`, `--service <SERVICE>`
* `-r`, `--rule <RULE>`
* `--list`
* `-t`, `--trace`



## `tc scaffold`

Scaffold roles and infra vars

**Usage:** `tc scaffold`



## `tc test`

Run unit tests for functions in the topology dir

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

**Usage:** `tc unfreeze [OPTIONS] --sandbox <SANDBOX>`

###### **Options:**

* `-d`, `--service <SERVICE>`
* `-e`, `--profile <PROFILE>`
* `-s`, `--sandbox <SANDBOX>`
* `--all`
* `-t`, `--trace`



## `tc update`

Update components

**Usage:** `tc update [OPTIONS]`

###### **Options:**

* `-e`, `--profile <PROFILE>`
* `-R`, `--role <ROLE>`
* `-s`, `--sandbox <SANDBOX>`
* `-c`, `--component <COMPONENT>`
* `-a`, `--asset <ASSET>`
* `--notify`
* `-r`, `--recursive`
* `--no-cache`
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



## `tc doc`

Generate documentation

**Usage:** `tc doc [OPTIONS]`

###### **Options:**

* `-s`, `--spec <SPEC>`



<hr/>
