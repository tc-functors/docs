---
title: Specification in LISP
description: Specification in LISP
---

:::note
Lisp interpreter is available in upcoming tc 0.10.x
:::


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
