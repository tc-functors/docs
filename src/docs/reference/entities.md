# Entities

## Matrix

Not all entities are composable with each other. The following shows the compatibility Matrix and their implementation status


|          | Function | Event | Queue | Route | Channel | Mutation |
|----------|----------|-------|-------|-------|---------|----------|
| Function | No*      | No    | No*   | No    | No      | No       |
| Event    | Yes      | No    | No    | No    | Yes     | No       |
| Route    | Yes      | No*   | No*   | -     | No      | No       |
| Queue    | Yes      | No    | -     | No    | No      | No       |
| Channel  | Yes      | Yes   | No    | No    | -       | No       |
| Mutation | Yes      | No*   | No    | No    | No      | -        |

```admonish info
* indicates that it is currently being implemented
```
