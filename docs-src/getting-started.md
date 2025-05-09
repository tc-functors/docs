# Getting started

<!-- toc -->

Caveat: this is a rough draft and we are still working on the documentation.

Now that we have installed `tc` and understood the features in abstract, let's try to walk through a basic tutorial of creating an ETL (Enhance-Transform-Load) flow using serverless entities.

In this tutorial, we will attempt to learn about the core concepts in tc.

## 1. Bootstrap permissions

Let's create some base IAM roles and policies for your sandbox. `tc` maps environments to AWS profiles. There can be several sandboxes per environment/account. For the sake of this example, let's say we have a profile called `dev`. This dev profile/account can have several dev sandboxes. Let's name our sandbox `john`.

```
tc create -s john -e dev -c base-roles
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


```admonish info
AWS Lambda is the default implementation for the function entity. env here is typically the AWS profile.
```

## 3. Namespacing your functions

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

```admonish info
The word service is overloaded. tc encourages the use of functor or topology to define the collection of entities.
```

## 4. Defining the flow

Now that we have these functions, we need to orchestrate the flow between them. tc provides a number of mechanisms to define the flow

1. Event-based flow (Eventbridge)
2. State Transitions (Stepfunctions)
3. Mutations (Appsync/Graphql)
4. Function Chaning (Lambda desitinations)

### 4.1 Event-based flow

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

We can update just the `events` component or entity. The following creates the eventbridge rules wiring up the enhancer, transformer and loader functions

```sh
tc update -s john -e dev -c events
```
We should see an output like:
```
Compiling topology
Resolving events...
Updating functor etl@john.dev/0.0.1/events
```
With event-based functions, function needs to explicitly out the eventbridge event. We could alternatively use stepfunction that has a managed orchestrator. Let's define the stepfunction flow.

We can remove the events above for now

```sh
tc delete -s john -e dev -c events
```

Much like update, we can delete selectively delete few entities without touching other parts of the topology.

## 4.2 State Transitions

The following defines a simple linear flow using ASL (Amazon States Language).

```yaml
name: etl

flow:
    Comment: ETL
    StartAt: enhance
    TimeoutSeconds: 1200
    States:
      enhance:
        Type: Task
        Resource: arn:aws:states:::lambda:invoke
        OutputPath: $.Payload
        InputPath: $
        Parameters:
          FunctionName: '{{namespace}}_enhancer_{{sandbox}}'
          Payload:
            data.$: $
        Next: transform
      transform:
        Type: Task
        Resource: arn:aws:states:::lambda:invoke
        OutputPath: $.Payload
        InputPath: $
        Parameters:
          FunctionName: '{{namespace}}_transformer_{{sandbox}}'
          Payload:
            data.$: $
        Next: transform
      load:
        Type: Task
        Resource: arn:aws:states:::lambda:invoke
        OutputPath: $.Payload
        InputPath: $
        Parameters:
          FunctionName: '{{namespace}}_loader_{{sandbox}}'
          Payload:
            data.$: $
        End: true
```

To deploy the above flow:

```
tc create -s john -e dev -c flow
```

It should output the following:
```
Compiling topology
Resolving events...
Updating functor etl@john.dev/0.0.1/flow
```


## 5. Adding a trigger to the topology

We may want to trigger the ETL topology via an API route

```yaml
name: etl

events:
  EnhancerComplete:
    producer: enhancer
    function: '{{namespace}}_transformer_{{sandbox}}'

  TransformerComplete:
    producer: transformer
    function: '{{namespace}}_loader_{{sandbox}}'

routes:
  /start-etl:
    gateway: api-test
    function: '{{namespace}}_enhancer_{{sandbox}}'
    sync: false
    method: POST
```

The `routes` map in the topology defines a set of routes backed by serverless entities. In this example, /start-etl triggers the lambda function. Now, we can incrementally update the routes


```sh
tc update -s john -e dev -c routes
```
We should see an output like:
```
Compiling topology
Resolving topology...
Resolving routes...
Updating functor etl@john.dev/0.0.1/routes
Creating route POST /start-etl
Creating integration function
Creating gateway stage test
Endpoint https://seuz7un8rc.execute-api.us-west-2.amazonaws.com/test

```

Now just trigger the ETL topology using

```sh
curl https://seuz7un8rc.execute-api.us-west-2.amazonaws.com/test/start-etl -X POST -d '{"hello": "world"}'
=> {"enhancer": "abc"}
```

### 6. Implementing the functions


So far, we created a topology with basic functions, events, routes and a flow to connect them all. The functions themselves don't do much. Functions have depedencies, different runtimes or languages, platform-specific shared libraries and so forth. For example, we have want the enhancer to have some dependencies specified in say pyproject.toml or requirements.txt. Let's add a file named `function.json` in enhancer directory

enhancer/function.json
```json

{
  "name": "enhancer",
  "description": "Ultimate enhancer",
  "runtime": {
    "lang": "python3.12",
    "package_type": "zip",
    "handler": "handler.handler",
  },
  "build": {
    "kind": "Inline",
    "command": "zip -9 -q lambda.zip *.py"
  },
}
```
and let's say we had the following deps in `pyproject.toml`

enhancer/pyproject.toml
```
[tool.poetry]
name = "enhancer"
version = "0.1.0"
description = ""
authors = ["fu <foo@fubar.com>"]

[tool.poetry.dependencies]
simplejson = "^3.19.2"
botocore = "^1.31.73"
boto3 = "^1.28.73"
pyyaml = "6.0.2"
```

Now update the function we created by running this from the `etl` directory

```sh
tc update -s john -e dev -c enhancer
```

The above command will build the dependencies in a docker container locally and update the function code with the depedencies.

```admonish info
-c argument takes an entity category (events, functions, mutations, routes etc) or the name of the entity itself. In this case the function name.
```

There are several ways to package the depedencies depending on the runtime, size of the dependencies and so forth. Layering is another kind. Let's try and build the transformer using layers. Add the following in transformer/function.json

transformer/function.json

```json

{
  "name": "transformer",
  "description": "Ultimate Transformer",
  "runtime": {
    "lang": "python3.12",
    "package_type": "zip",
    "handler": "handler.handler",
	"layers": ["transformer-deps"]
  }
}
```
The layers can be built independent of creating/deploying the code, as they don't change that often.

```sh

tc build --kind layer --name transformer-deps --publish -e dev
tc update -s john -e dev -c layers
```
With the above command, we built the dependencies in a docker container and updated the function(s) to use the latest version of the layer. See [Build](/docs/modules/builder.html) for details about building functions.


## 7. Making it recursive

We can make loader itself another sub-topology with it's own DAG of entities and still treat etl as the root topology (or functor). Let's add a topology file in loader.

etl/loader/topology.yml
```
name: loader

```

Now we can recursrively create the topologies from the root topology directory

```
tc create -s john -e dev --recursive
```


### 8. Creating the first release

tc provides a sophisticated releaser module that can version at any level in the topology tree. Instead of managing the versions of each function, route, flow etc, we create a release tag at the top-level


```sh
tc tag -s etl --next minor|major
```

This creates a tag in git for the ETL topology.

## 9. Configuring infrastructure

At times, we require more infrastructure-specific configuration, specific permissions, environment variables, runtime configuration.

We can specify an infra path in the topology

```yaml
name: etl
infra: "../infra/etl"
routes: ..
```

In the specified infra directory, we can add environment/runtime variables for let's say enhancer.

../infra/etl/vars/enhancer.json

```json
{
  "memory_size": 1024,
  "timeout": 800,
  "environment": {
    "GOOGLE_API_KEY": "ssm:/goo/api-key",
    "KEY": "VALUE"
  },
  "tags": {
    "developer": "john"
  }
}

```

If we need specific IAM permissions, do

../infra/etl/roles/enhancer.json

```json
{
    "Statement": [
        {
            "Action": [
                "s3:PutObject",
                "s3:ListBucketVersions",
                "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::bucket/*",
                "arn:aws:s3:::bucket"
                     ],
            "Sid": "AllowAccessToS3Bucket1"
        }

    ],
    "Version": "2012-10-17"
}

```

We may also need additional configuration that are specific to the provider (AWS etc).
Add a key called config with the value as path to the file.

```yaml
name: etl
infra: "../infra/etl"
config: "../tc.yaml"
routes: ..
```

See [Config](/docs/specification/config.html)
