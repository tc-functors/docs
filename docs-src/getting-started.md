# Getting started

<!-- toc -->

Now that we have installed `tc` and understood the features in abstract, let's try to walk through a basic tutorial of creating an ETL (Enhance-Transform-Load) flow using serverless entities.

## Bootstrap permissions

Let's create some base IAM roles and policies. `tc` maps environments to AWS profiles. There can be several sandboxes per environment/account. For the sake of this example, let's say we have a profile called `dev`. This dev profile/account can have several dev sandboxes.

```
tc bootstrap --roles -e dev
```

## A basic function

A simple function looks like this. Let's call this function `enhancer`. Add a file named `handler.py` in a directory etl/enhancer.

handler.py:

```python
def handler(event, context):
  return {'enhancer': 'abc'}
```

In the foo directory, you can now create the function by running the following command.

```sh
tc create -s <sandbox-name> -e <env>

Example: tc create -s john -e dev
```

This creates a lambda function named `enhancer_john` with the base role (tc-base-lambda-role) as the execution role.


```admonish. info
AWS Lambda is the default implementation for the function entity. env here is typically the AWS profile.
```

## Namespacing your functions

Our `etl` directory now contains just one function called `enhancer`. Let's create the `transformer` and `loader` functions. Add the following files.

transformer/handler.py

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

The resulting lambda functions are named '<namespace>_<function-name>_<sandbox>'. If the name is sufficiently long, tc abbreviates it

We can test these functions, independently

```
cd enhancer
tc invoke -s john -e dev -p '{"somedata": 123}'
```

```admonish info
The word service is overloaded. tc encourages the use of functor or topology to define the collection of entities.
```

## Defining the flow

Now that we have these functions, we need to orchestrate the flow between them. tc provides a number of mechanisms to define the flow

1. Event-based flow (Eventbridge)
2. State Transitions (Stepfunctions)
3. Mutations (Appsync/Graphql)
4. Function Chaning (Lambda desitinations)

### Event-based flow

```yaml
name: etl

events:
  EnhancerComplete:
    producer: enhancer
    function: '{{namespace}}_transformer_{{sandbox}}'

  TransformerComplete:
    producer: transformer
    function: '{{namespace}}_loader_{{sandbox}}'
```

```sh
tc update -s john -e dev -c events
```

### Stepfunctions

Alternatively, we can use stepfunctions to orchestrate the flow.

```yaml

```


### Mutations

```yaml
mutations:
  authorizer: '{{namespace}}_authorizer_{{sandbox}}'
  types:
    Input:
      id: String!
    Status:
      id: String!
      status: String
      message: String
      percentage: Int

  resolvers:
    initialize:
      function: '{{namespace}}_initializer_{{sandbox}}'
      input: Input
      output: Status
      subscribe: true

    enhance:
      function: '{{namespace}}_enhancer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    transform:
      function: '{{namespace}}_transformer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    load:
      function: '{{namespace}}_loader_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true

    complete:
      function: '{{namespace}}_completer_{{sandbox}}'
      input: Event
      output: Status
      subscribe: true
```

## Adding a trigger to the topology

```yaml
name: etl

routes:
  /start-etl:
    gateway: api-test
    function: '{{namespace}}_enhancer_{{sandbox}}'
    kind: http
    timeout: 10
    async: false
    method: POST
```

```sh
tc update -s john -e dev -c routes
```

## Configuring infrastructure
