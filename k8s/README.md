# Setting up OC in k8s

## postgresql

You need to run this first:

```
mkdir -p /Users/Shared/data/openclimate/
```

Then, apply all these files:

- postgresql-persistentvolume
- postgresql-persistentvolumeclaim
- postgresql-deployment
- postgresql-service