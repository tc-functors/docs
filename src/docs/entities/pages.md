# Pages

<!-- toc -->

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

## Example: JobTracker


## Dynamic Configuration


## Components



To update specific components

```sh
tc update -s sandbox -e profile -c pages/code
tc update -s sandbox -e profile -c pages/build
```
