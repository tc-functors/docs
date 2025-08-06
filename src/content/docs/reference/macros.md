---
title: Macros
description: Topology Macros
---

The following are some topology macros that can be inserted in topology.yml file.


### !include

You could break out the entities if they are large in number and hard to manage. Something like:

```yaml
name: my-topology
routes: !include ./routes.yml
events: !include ./events.yml
mutations: !include ./mutations.yml
...
```

### !break



### !skip
