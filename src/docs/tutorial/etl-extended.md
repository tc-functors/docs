## 6. Notify on completion

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
    event: Notify

events:
  Notify:
    channel: Subscription

channels:
  Subscription:
    function: default
```

Let's make `loader` output an event that pushes the status message to a websocket channel. `tc update -s john -e dev` to create/update the events and channels.

```sh
curl https://seuz7un8rc.execute-api.us-west-2.amazonaws.com/test/start-etl -X POST -d '{"hello": "world"}'
=> {"enhancer": "abc"}
```

## 7. Implement the functions


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


## 8. Making it recursive

We can make loader itself another sub-topology with it's own DAG of entities and still treat etl as the root topology (or functor). Let's add a topology file in loader.

etl/loader/topology.yml
```
name: loader

```

Now we can recursrively create the topologies from the root topology directory

```
tc create -s john -e dev --recursive
```

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
