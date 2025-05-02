# Getting started

<!-- toc -->

Now that we have installed `tc` and understood the features in abstract, let's try to walk through


## Bootstrap permissions

Let's create some base IAM roles and policies. `tc` maps environments to AWS profiles. There can be several sandboxes per environment/account. For the sake of this example, let's say we have a profile called `dev`. This dev profile/account can have several dev sandboxes.

```
tc bootstrap --roles -e dev
```

## A basic function

A simple python function (lambda) looks like this.

```python

```

## Namespacing your functions


## Create your sandbox


## Configuring infrastructure
