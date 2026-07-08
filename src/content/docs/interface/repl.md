---
title: REPL
description: REPL interface
---

tc's REPL (Read Eval Print Loop) exposes the commands in a persistent shell to the sandbox. This caches all the sandbox metadata on boot and makes subsequent commands run significantly faster. This is good for iterative and interactive development.

[![REPL image]][REPL source]

[REPL image]: ../../../assets/repl.gif
[REPL source]: ../../../assets/repl.gif


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
