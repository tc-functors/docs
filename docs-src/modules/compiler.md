# Compiler

`tc compile` does the following:

1. Discovers functions recursively in the current directory.
2. Generates build instructions for the discovered functions.
3. Interns remote, shared and local functions
4. Reads the topology.yml file and validates it using input specification
5. Generates the target representations for these entities specific to a provider
6. Generates graphql output for mutations definition in topology.yml
7. Transpiles flow definitions to stepfn etc.
8. Generates checksum of all function directories
9. Detects circular flows


To generate the topology in curent directory

```
tc compile [--recursive]

```

```admonish info
We can also set TC_DIR environment variable to not compile in the current directory
```


To generate tree of all functions

```
cd examples/apps/retail
tc compile -c functions -f tree

retail
├╌╌ payment
┆   ├╌╌ payment_stripe_{{sandbox}}
┆   ┆   ├╌╌ python3.10
┆   ┆   ├╌╌ provided
┆   ┆   └╌╌
┆   └╌╌ payment_klarna_{{sandbox}}
┆       ├╌╌ python3.10
┆       ├╌╌ provided
┆       └╌╌
├╌╌ pricing
┆   └╌╌ pricing_resolver_{{sandbox}}
┆       ├╌╌ python3.10
┆       ├╌╌ provided
┆       └╌╌

```
