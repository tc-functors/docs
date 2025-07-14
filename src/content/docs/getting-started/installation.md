---
title: Installation
description: Topology Composer
---

Download the executable for your OS

| GNU/Linux x86                                                                   | MacOSX M1/M2                                                       |
|---------------------------------------------------------------------------------|--------------------------------------------------------------------|
| [0.8.90](https://github.com/tc-functors/tc/releases/download/0.8.90/tc-x86_64-linux) | [0.8.90](https://github.com/tc-functors/tc/releases/download/0.8.90/tc-aarch64-macos)


:::caution

For Mac Users:

The first time you run the downloaded executable you will get a popup that says it may be "malicious software"

Do the following:
* Go to `Privacy & Security` panel to the `Security/Settings` section
* Should have `App Store and identified developers` selected
* Where it says `tc was blocked from use becasue it is not from an identified developer`
    * Click on `Allow Anyway`

mv ~/Downloads/tc /usr/local/bin/tc

chmod +x /usr/local/bin/tc

:::


## Upgrading

To upgrade tc, we can just do:

```
tc upgrade
```

or downgrade/upgrade to specific version

```
tc upgrade --version 0.8.90
```


## Building your own

`tc` is written in [Rust](https://www.youtube.com/watch?v=ul9vyWuT8SU).

If you prefer to build `tc` yourself, install rustc/cargo.

Install Cargo/Rust https://www.rust-lang.org/tools/install

```sh
cd tc
cargo build --release
sudo mv target/release/tc /usr/local/bin/tc
```
