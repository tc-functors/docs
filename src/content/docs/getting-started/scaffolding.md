---
title: Scaffolding
description: Scaffolding
---

## Scaffold Functions

To scaffold function dirs and function.yml in a topology dir:

```sh
tc scaffold --functions
```

## Generate topology using LLM

We can use Bedrock or Claude to generate a topology, instead of defining it manually.

```sh
tc scaffold --provider bedrock -e <profile> --llm default
> Architecture Description: Generate a topology to compute sum of two numbers. Notify result via channel
```
To use Anthropic/Claude, set `CLAUDE_API_KEY` env variable and

```sh
tc scaffold --provider bedrock -e <profile> --llm default
```

This generates a topology.yml using default Skills/prompt that describes the principles and design in entity abstraction, composition, orchestration and namespacing. We can generate the function stubs for the functions defined in the topology:

```sh
tc scaffold --functions
```

#### Using custom prompts

We can also use custom prompts or Skills. These skills can be specific to projects, design consideration and costing.

```
cat Skills.md | tc scaffold --provider bedrock -e <profile> --llm --
```

#### Screencast

[![llm image]][llm source]

[llm image]: ../../../assets/scaffold-llm.gif
[llm source]: ../../../assets/scaffold-llm.gif

## Scaffold IAC

```
tc scaffold -e dev --iac tf --out-dir tf
```

```
tc scaffold -e dev --iac cdk --out-dir cdk
```
