---
title: REPL
description: REPL interface
---

[![REPL image]][REPL source]

[MCP image]: ../../../assets/repl.gif
[MCP source]: ../../../assets/repl.gif


### Lisp Interpreter

Available in 0.10.x
```
./tc repl
> (define-event e1)
> (define-event e2)
> (define-function f1 :uri "git://repo/f1.git")
> (def topology (compose f1 e1 f2))
> (print-tree topology)
```
