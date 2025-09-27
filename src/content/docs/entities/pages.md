---
title: Pages
description: Pages Entity Reference
---

`page` entity helps abstract web pages (SPA, SSR, PWA etc). It provides a mechanism to orchestrate your app with edge and regular functions in a framework-agnostic way

## Single Page Apps

```
name: topology-name

pages:
  my-app:
    kind: SPA | PWA | Static
    dist: 'app/dist' <optional>
    dir: 'app'
    build:
      - npm install --quiet
      - npm run build
```

:::note
dist is the path to directory containing the final HTML, javascript and other assets to be deployed. It is not relative to the specified dir but relative to the topology file.
:::

See [Examples](https://github.com/tc-functors/tc/tree/main/examples/pages)

## Dynamic Configuration

`tc` injects secrets and configs dynamically for a sandbox during build time.

Let's say you have `frontend/.env` or src/config.json file with the following template variables. tc will render the template variables and resolve the right URI.

```js

APPSYNC__URL={{GRAPHQL_ENDPOINT}}
APPSYNC_GRAPHQL_URL="{{GRAPHQL_WSS_ENDPOINT}}"
REST_ENDPOINT="{{REST_ENDPOINT}}"
GRAPHQL_API_KEY=ssm://path/to/my/key
MY_SECRET_KEY=ssm://path/to/my/key
```

Dynamic config can be enabled by specifying the path to the config. Typically it is a `dotenv` file

```
pages:
  my-app:
    kind: SPA | PWA | Static
    dir: frontend
    config_template: .env
    build:
      - npm install --quiet
      - npm run build
```

The following variables are available based on the entity defined:

| Entity   | Variable             |
|----------|----------------------|
| Mutation | GRAPHQL_ENDPOINT     |
| Mutation | GRAPHQL_ID           |
| Mutation | GRAPHQL_WSS_ENDPOINT |
| Mutation | GRAPHQL_API_KEY      |
| Route    | REST_ENDPOINT        |
| Generic  | REGION               |
| Generic  | ACCOUNT              |


The config file rendered is specific to the sandbox and is created at the time of building the frontend page or app.


#### Entity URIs

We can also inject URLs from other namespaces in the .env file. For example, the following resolves the GRAPHQL_URL from a diferrent namespace:

```
GRAPHQL_ENDPOINT=mutation://OTHER-NAMESPACE_{{SANDBOX}}
```


:::note
tc can only render variables associated with entities defined in the topology. For example, if you have routes, then REST_ENDPOINT is available. If mutations are defined, GRAPHQL_ENDPOINT is available. If channels are defined, CHANNEL_URL is available.
:::


## Customization


### Domains


tc creates domains, certs and associates the aliases. Assuming you have created the domains to associate, for example foo.com , we can set them either in the topology file or correspoding infra dir.

```
pages:
  dashboard:
    dir: dir1
    domains:
      stable: dashboard.foo.com
  onboarding:
    dir: dir2
    domains:
      stable: onboarding.{{env}}.foo.com
```

We can also specify a more detailed mapping in `infrastructure/tc/<namespace>/pages/<page>.json`:

```
{
  "bucket": "my-bucket-{{env}}",
  "domains": {
    "default": {
      "stable": "app.{{env}}.foo.com",
      "yoda": "app-yoda.{{env}}.foo.com",
      "test": "app-test.{{env}}.foo.com"
    },
    "prod": {
      "stable": "app.foo.com"
    }
  }
}

```


### Bucket

The S3 bucket to host the static assets can be configured in any of the following ways:

1. Set bucket in topology (not recommended as it leaks infrastructure variables into topology definition)

```
pages:
  dashboard:
    dist: '.'
	bucket: 'my-bucket-{{env}}'
```

2. Set `TC_PAGES_BUCKET` env var

```
export TC_PAGES_BUCKET=my-bucket-prod
```

3. Set it in tc config (in path specified in TC_CONFIG_PATH env variable)

```
aws:
  cloudfront:
    bucket: 'my-bucket-{{env}}'
```

## Components


To update specific components

```sh
tc update -s sandbox -e profile -c pages/code
tc update -s sandbox -e profile -c pages/build
tc update -s sandbox -e profile -c pages/domains
tc update -s sandbox -e profile -c pages/config
```

Or you can update a specific page

```sh
tc update -s sandbox -e profile -c pages/dashboard
```
