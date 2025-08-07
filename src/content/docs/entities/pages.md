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
    dist: 'app/dist'
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

Let's say you have src/config.js or src/config.json file with the following template variables. tc will render the template variables and resolve the right URI.

```js

const APPSYNC_REALTIME_URL="{{CHANNEL_URL}}"
const APPSYNC_GRAPHQL_URL="{{GRAPHQL_REALTIME_URL}}"
const REST_ENDPOINT="{{REST_API_ENDPOINT}}"
const API_KEY="ssm://path/to/my/key"
const MY_DATA="s3://bucket/prefix/key"
```

Dynamic config can be enabled by specifying the path to the config

```
pages:
  my-app:
    kind: SPA | PWA | Static
    dist: app/dist
    dir: app
    config: app/src/config.json
    build:
      - npm install --quiet
      - npm run build
```

:::note
tc can only render variables associated with entities defined in the topology. For example, if you have routes, then REST_API_ENDPOINT is available. If mutations are defined, GRAPHQL_REALTIME_URL is available. If channels are defined, CHANNEL_URL is available.
:::


## Customization


### Domains


tc does not create domains, zones or certs. Assuming you have created the domains to associate, for example foo.com , you can set them either in the topology file or correspoding infra dir.

```
pages:
  dashboard:
    dist: '.'
    domains:
      - dashboard.foo.com
  onboarding:
    dist: '.'
    domains:
      - onboarding.foo.com
```

### Bucket

The S3 bucket to host the static assets can be configured in any of the following ways:

1. Set bucket in topology (not recommended as it leaks infrastructure variables into topology definition)

```
pages:
  dashboard:
    dist: '.'
	bucket: 'my-bucket-{{env}}'
    domains:
      - dashboard.foo.com
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
```

Or you can update a specific page

```sh
tc update -s sandbox -e profile -c pages/dashboard
```
