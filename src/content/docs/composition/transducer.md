---
title: Transducer
description: Transducing Orchestrators
---

tc provides a mechanism to override how the entities are composed. This mechanism is called `Entity Transduction`. The concept is borrowed from Clojure's [transducer](https://clojuredocs.org/clojure.core/transduce) and applies it to serverless entity composition.

The same topology that is used by tc to deploy the entities can be used for orchestration. The transducer generates code that is run by the `target orchestrator`.

There are 3 kinds of transducers that tc provides:

1. function (default)
2. ASL
3. custom

### Function

```yaml
name: example

transducer: Function

functions:
  foo:
    function: bar
  bar:
    function: baz
```

When transducer is function, tc generates a lambda function for the topology. This lambda function (misleadingly called the transducer), orchestrates the flow of data between entities based on the topology input.

`tc compose -c transducer` shows the generated function code. Typically it looks like:

```python

def trigger_targets(targets, payload):
  event_metadata = targets.get("event")
  mutation_metadata = targets.get("mutation")
  function_arn = targets.get("function")
  channel_metadata = targets.get("channel")
  if event_metadata is not None:
    trigger_event(event_metadata, payload)

  if function_arn is not None:
    trigger_function(function_arn, payload)

  if mutation_metadata is not None:
    trigger_mutation(mutation_metadata, payload)

  if channel_metadata is not None:
    trigger_channel(channel_metadata, payload)
  return True

def load_metadata(source_arn):
  with open('transducer.json') as json_data:
    d = json.load(json_data)
    targets = d.get('targets').get(source_arn)
    json_data.close()
    return targets

def make_input(response_payload):
  if 'detail' in response_payload and 'detail-type' in response_payload:
    return response_payload.get('detail')
  else:
    return response_payload

def handler(event, context):
  input = make_input(event.get('responsePayload'))
  s = event.get('requestContext').get('functionArn')
  source_arn = s.rsplit(':', 1)[0]
  targets = load_metadata(source_arn)
  res = trigger_targets(targets, input)
  return res
```
The actual code generated is fairly sophisticated and knows how to trigger or invoke the target entities synchronously or asynchronously. The `function` transducer has an additional overhead of running it alongside other entities. This may not be cost-effective, relatively speaking.


### ASL

When tranducer is set as ASL (Amazon States Language), tc generates the ASL code and renders it as a stepfunction. This mechanism uses stepfunction as an orchestrator.

```yaml
name: example

transducer: ASL

functions:
  foo:
    function: bar
  bar:
    function: baz
```
### Custom

We can create a custom transducer that takes in a topology and generates a target output (say Airflow, Flink etc).

```yaml
name: example

transducer: ./my-airflow-transducer.py
```

The transducer output as part of compose output and we can render it in the target orchestrator. Something like:

```
tc compose -f transducer | airflow start
```
