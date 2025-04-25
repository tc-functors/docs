## Function Specification

function.json file in the function directory is optional. `tc` infers the language and build instructions from the function code. However, for custom options, add a function.json that looks like the following


```json
{
  "name": "string",
  // Optional
  "dir": "string",
  // Optional
  "description": "string",
  // Optional
  "namespace": "string",
  // Optional
  "fqn": "string",
  // Optional
  "layer_name": "string",
  // Optional
  "version": "string",
  // Optional
  "revision": "string",
  // Optional
  "runtime": {
    "lang": "Python39" | "Python310" | "Python311" | "Python312" | "Python313" | "Ruby32" | "Java21" | "Rust" | "Node22" | "Node20",
    "handler": "string",
    "package_type": "string",
    // Optional
    "uri": "string",
    // Optional
    "mount_fs": true,
    // Optional
    "snapstart": true,
    "layers": [
      "string",
      /* ... */
    ],
    "extensions": [
      "string",
      /* ... */
    ]
  },
  // Optional
  "build": {
    "kind": "Code" | "Inline" | "Layer" | "Slab" | "Library" | "Extension" | "Runtime" | "Image",
    "pre": [
      "dnf install git -yy",
      /* ... */
    ],
    "post": [
      "string",
      /* ... */
    ],
    // Command to use when build kind is Code
    "command": "zip -9 lambda.zip *.py",
    "images": {
      "string": {
        // Optional
        "dir": "string",
        // Optional
        "parent": "string",
        // Optional
        "version": "string",
        "commands": [
          "string",
          /* ... */
        ]
      },
      /* ... */
    },
    "layers": {
      "string": {
        "commands": [
          "string",
          /* ... */
        ]
      },
      /* ... */
    }
  },
  // Optional
  "infra": {
    "dir": "string",
    // Optional
    "vars_file": "string",
    "role": {
      "name": "string",
      "path": "string"
    }
  }
}
```


### Runtime Spec

| Key                     | Default           | Optional? | Comments                    |
|-------------------------|-------------------|-----------|-----------------------------|
| lang                    | Inferred          | yes       |                             |
| handler                 | handler.handler   |           |                             |
| package_type            | zip               |           | possible values: zip, image |
| uri                     | file:./lambda.zip |           |                             |
| mount_fs                | false             | yes       |                             |
| snapstart               | false             | yes       |                             |
| memory                  | 128               | yes       |                             |
| provisioned_concurrency | 0                 | yes       |                             |
| reserved_concurrency    | 0                 | yes       |                             |
| layers                  | []                | yes       |                             |
| extensions              | []                | yes       |                             |
| environment             | {}                | yes       | Environment variables       |


### Infra Spec



### Build Spec
