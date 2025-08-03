---
title: Lisp
description: Transpiler in Lisp
---

For engineers who wish to use a proper programming language to express the entities and their composition, there is a Lisp interpreter that transpiles to unrelying topology bincode.

tc-lisp provides a couple of core  macros `defentity`, `compose` to define the topology


```lisp

(ns my-app)

(defroute api
    :path "/api"
    :method :post
    :authorizer 'authorizer)

(defun bar
    :uri "github.com/bar/bar")

(defevent Completed)

(defchannel my-room)

(compose
  route/api
  function/bar
  event/Completed
  channel/my-room)

```


```sh
tc-lisp -c topology.lisp | tc create -s dev1 -e dev --bin
```

We can also define more complex flows that use the `map` and `reduce` for example:

```
(compose
  route/api
  (map
   '(function/bar function/baz))
  (reduce)
  event/Completed
  channel/my-room)

```

### Emacs integration

tc-lisp-mode wip


:::note

tc-lisp is still being developed. Will be opensourced soon. Stay tuned!
:::
