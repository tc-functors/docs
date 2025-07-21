---
title: Quick Start
description: Quick Start Guide
---

:::note
This is a rough draft and we are still working on the documentation.
:::

Now that we have installed `tc` and understood the features in abstract, let's try to walk through a basic tutorial of creating an ETL (Enhance-Transform-Load) flow using serverless entities.

In this tutorial, we will attempt to learn about the core concepts in tc.

## 1. Bootstrap permissions

Let's create some base IAM roles and policies for your sandbox. `tc` maps environments to AWS profiles. There can be several sandboxes per environment/account. For the sake of this example, let's say we have a profile called `dev`. This dev profile/account can have several dev sandboxes with common base roles. To create these base roles:

```
tc bootstrap -e dev
```

## 2. Our first function

A simple function looks like this. Let's call this function `enhancer`. Add a file named `handler.py` in a directory etl/enhancer.

etl/enhancer/handler.py:

```python
def handler(event, context):
  return {'enhancer': 'abc'}
```

In the etl directory, we can now create the function by running the following command.

```sh
tc create -s <sandbox-name> -e <env>

Example: tc create -s john -e dev
```

This creates a lambda function named `enhancer_john` with the base role (tc-base-lambda-role) as the execution role.


:::note
AWS Lambda is the default implementation for the function entity. env here is typically the AWS profile.
:::

## 3. Namespace your functions

Our `etl` directory now contains just one function called `enhancer`. Let's create the `transformer` and `loader` functions. Add the following files.

etl/transformer/handler.py

```python
def handler(event, context):
  return {'transformer': 'ABC'}

```

loader/handler.py

```python
def handler(event, context):
  return {'transformer': 'ABC'}

```
We should have the following directory contents:

```
etl
|-- enhancer
|   `-- handler.py
|-- loader
|   `-- handler.py
|-- topology.yml
`-- transformer
    `-- handler.py
```

Now that we have these 3 functions, we may want to collectively call them as `etl`. Let's create a file named `topology.yml` with the following contents:

```yaml
name: etl
```

`name` is the namespace of these collection of functions.
Now in the etl directory, we can run the following command to create a sandbox

```
tc create -s john -e dev
```
You should see the following output

```
Compiling topology
Resolving topology etl
1 nodes, 3 functions, 0 mutations, 0 events, 0 routes, 0 queues
Building transformer (python3.10/code)
Building enhancer (python3.10/code)
Building loader (python3.10/code)
Creating functor etl@john.dev/0.0.1
Creating function enhancer (211 B)
Creating function transformer (211 B)
Creating function loader (211 B)
Checking state enhancer (ok)
Time elapsed: 5.585 seconds
```

The resulting lambda functions are named 'namespace_function-name_sandbox'. If the name is sufficiently long, tc abbreviates it

We can test these functions, independently

```
cd enhancer
tc invoke -s john -e dev -p '{"somedata": 123}'
```

:::tip
The word service is overloaded. tc encourages the use of functor or topology to define the collection of entities.
:::

## 4. Define the function DAG (flow)

Now that we have these functions working in isolation, we may want to create a DAG of these functions. Let's define that flow:

```
name: etl

functions:
  enhancer:
    root: true
    function: transformer
  transformer:
    function: loader
  loader:
	end: true

```

`tc` dynamically figures out the orchestrator to use. By default, it uses Stepfunction (Express) to orchestrate the flow. `tc` automatically generates an intimidating stepfunction definition. You can inspect that by running `tc compile -c flow`


`tc update -s john -e dev` to update and create the flow.

## 5. Add a REST API to invoke ETL

```
name: etl

routes:
  /api/etl:
    method: POST
    function: enhancer

functions:
  enhancer:
    root: true
    function: transformer
  transformer:
    function: loader
  loader:
	end: true
```

Run `tc update -s john -e dev -c routes` to update the routes.
