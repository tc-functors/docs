# Job Tracker

Let's explore another example that uses Mutations to track status of arbitrary jobs

```yaml

name: job-tracker
events:
  consumes:
    CompleteTask:
      producer: adHoc
      mutation: completeJob

mutations:
  authorizer: '{{namespace}}_authorizer_{{sandbox}}'
  types:
    JobInput:
      id: String!
    Job:
      id: String!
      status: String
      message: String

  resolvers:
    listJobs:
      function: '{{namespace}}_lister_{{sandbox}}'
      input: JobInput
      output: Job
      subscribe: false

    startJob:
      function: '{{namespace}}_starter_{{sandbox}}'
      input: JobInput
      output: Job
      subscribe: true

    completeJob:
      function: '{{namespace}}_completer_{{sandbox}}'
      input: Event
      output: Job
      subscribe: true
```
