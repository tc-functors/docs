# Invoker

<!-- toc -->


## Specifying Payload

To simply invoke a functor

```
tc invoke --sandbox main --env dev
```
By default, tc picks up a `payload.json` file in the current directory. You could optionally specify a payload file

```
tc invoke --sandbox main --env dev --payload payload.json
```

or via stdin
```
cat payload.json | tc invoke --sandbox main --env dev
```

or as a param
```
tc invoke --sandbox main --env dev --payload '{"data": "foo"}'
```

### Invoking Events and Lambdas

By default, `tc` invokes a stepfn. We can also invoke a lambda or trigger an Eventbridge event

```
tc invoke --kind lambda -e dev --payload '{"data"...}'
tc invoke --kind event -e dev --payload '{"data"...}'
```
