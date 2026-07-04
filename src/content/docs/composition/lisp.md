---
title: Composing entities using Lisp
description: Using Lisp for composition
---

:::note
Lisp interpreter is publicly available in upcoming tc 0.10.x
:::

While it is fairly straightforward to describe entity composition using YAML, tc provides a subset of the Lisp programming language to define compositions programatically. The reason Lisp is better suited at this is because of first-class entities, s-expressions and symbolic references.

```lisp

(define-event e1)

(define-event e2)

(define-function f1
    :uri "./f1"
    :runtime {:lang "python3.11"}
    :build {:kind 'inline})

(define-function f2
    :uri "./f2"
    :runtime {:lang "ruby3.3"}
    :build {:kind 'inline})

(define-function f3
    :uri "./f3"
    :runtime {:lang "clojure11.2"})

(define-route r1
    :path "/api/test"
    :async true)

(compose e1 f1 e2)

(compose r1 f1 f2 f3)
```

We can also use the LISP interpreter to load and eval the spec.

```sh
cat topology.lisp | ./tc compose --

#or

./mt --repl
> (define-event e1)
> (define-event e2)
> (define-function f1 :uri "git://repo/f1.git")
> (def topology (compose f1 e1 f2))
> (print-tree topology)
```
