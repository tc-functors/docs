# Pages

<!-- toc -->

## 1. Client-side Apps

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


## 2. SSR and Edge functions


## 3. Dynamic Configuration


## 4. Components


To update specific components

```sh
tc update -s sandbox -e profile -c pages/code
tc update -s sandbox -e profile -c pages/build
```
