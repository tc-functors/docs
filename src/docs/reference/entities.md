# Entities


## Composition Matrix

Functor entities are, by definition, composable with each other similar to functions in a functional programming language. The following shows the composability Matrix.


|          | Function | Event | Queue | Route | Channel | Mutation | Page |
|----------|----------|-------|-------|-------|---------|----------|------|
| Function |          |       |       |       |         |          |      |
| Event    | Yes      |       |       |       | Yes     | Yes      |      |
| Route    | Yes      |       |       |       |         |          |      |
| Queue    | Yes      |       |       |       |         |          |      |
| Channel  | Yes      |       |       |       |         |          |      |
| Mutation | Yes      | Yes   |       |       |         |          |      |

```admonish info
Not all entities are composable with each other.
```
