---
title: Pages
description: Topology Composer
---


## Client-side Apps

`page` entity helps abstract web pages (SPA, SSR, PWA etc).

```
name: topology-name

pages:
  my-app:
    kind: SPA | PWA | Static
    dist: './dist'
    dir: 'app'
    build:
      - npm install --quiet
      - npm run build
```


## SSR and Edge functions

WIP


## Dynamic Configuration

WIP


## Customization


### Domains


tc does not create domains, zones or certs. Assuming you have created the domains to associate, for example foo.com and bar.com, you can set them either in the topology file or correspoding infra dir.

```
pages:
  foo:
    dist: '.'
    domains:
      - foo.com
  bar:
    dist: '.'
    domains:
      - bar.com
```

### Bucket

You could set `TC_PAGE_BUCKET` env var

## Components


To update specific components

```sh
tc update -s sandbox -e profile -c pages/code
tc update -s sandbox -e profile -c pages/build
```
