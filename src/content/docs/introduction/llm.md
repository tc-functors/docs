---
title: LLM
description: Tc concepts
---

1. Graph-First Mental Model
This is the big one. Other tools think in resources (Terraform), services (Serverless Framework), or constructs (SST/CDK).
tc thinks in graphs and relationships:

Nodes = your 7 primitives (functions, events, routes, etc.)
Edges = how they connect and trigger each other
The infrastructure is just the rendering of this graphb


tc treats serverless apps as versioned, namespaced, composable graphs where infrastructure is derived rather than declared.


If Terraform is imperative, and CDK/Pulumi are object-oriented, tc is functional and declarative - inspired by OCaml, Clojure, and Erlang.
It's asking: "What if we designed serverless tooling like we design functional programs?"


The key idea:

You describe what your app does (routes, functions, events, queues, channels) in a simple YAML file
tc figures out how to deploy it (API Gateway, Lambda, EventBridge, etc.)
You never write infrastructure code directly
