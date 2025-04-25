# Infrastructure Spec

## Runtime Variables

Default Path: infrastructure/tc/<topology>/vars/<function>.json
Override: infra.vars_file in function.json


```json
{
  // Optional
  "memory_size": 123,
  // Optional
  "timeout": 123,
  // Optional
  "image_uri": "string",
  // Optional
  "provisioned_concurrency": 123,
  // Optional
  "reserved_concurrency": 123,
  // Optional
  "environment": {
    "string": "string",
    /* ... */
  },
  // Optional
  "network": {
    "subnets": [
      "string",
      /* ... */
    ],
    "security_groups": [
      "string",
      /* ... */
    ]
  },
  // Optional
  "filesystem": {
    "arn": "string",
    "mount_point": "string"
  },
  // Optional
  "tags": {
    "string": "string",
    /* ... */
  }
}
```

## Roles
