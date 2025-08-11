---
title: Permissions
description: Managing Permissions
---

## AWS IAM Permissions

tc provides 3 different mechanisms to specify permissions.


### Dynamic permissions

This is the default mechanism. When creating a sandbox, tc creates a base set of roles for the entity types defined in the topology. For example, if routes and events, functions are defined, tc creates `tc-base-route-<sandbox>` , `tc-base-event-<sandbox>`and `tc-base-function-<sandbox>` roles with corresponding inline policies. tc uses `ABAC` [Attribute Based Access Control](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html) to set tag-based access for entities in the sandbox. Entities defined outside the sandbox are not accessible.

The advantages of using _Dynamic permissions_:

1. The permissions are granular and secure.
2. We don't need to write any permissions manually, unless there are entity-specific overrides.


A major (questionable) disadvantage of _dynamic permissions_ is that it makes it harder to access entities outside the sandbox.


### Shared permissions

This is for those who'd like to have a set of base permissions to be used across all sandboxes. You could define a base set of permissions in TC_INFRA_DIR path.

For example:

```
ls infrastructure/tc/base/roles
- state.json
- function.json
- event.json
- route.json
- mutation.json
```
The contents are just IAM policies in JSON format. tc uses this as a template and renders them in sandboxes.

The permissions defined in shared base permission files are typically quite permissive and ABAC is nearly not possible. The advantags are that it is auditable by DevOps/Platform team.

### Global permissions

If you don't want to use either dynamic or shared, you could use `Global Permissions`. Provided permissions are like shared except it is not created per sandbox. There is no template.

This is best suited for teams where infrastructure and permissions are managed by dedicated teams and tools. For example, you could create the roles and permissions usind Cloudformation or Terraform, but would like to have tc just use it.

`tc-base-lambda-role`, `tc-base-event-role`, `tc-base-appsync-role`, `tc-base-route-role`, `tc-base-sfn-role` and `tc-base-mutation-role` are fixes names of the roles that tc can use. Setting `TC_LEGACY_ROLES` env variable ensures that tc uses these roles.

```
TC_LEGACY_ROLES=1 tc create/update/delete -s SANDBOX -e PROFILE

```
