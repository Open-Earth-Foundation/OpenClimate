# Setting up OC in k8s

kubectl create namespace openclimate
make directory at /User/Shared/data/openclimate

## postgresql

Edit `postgresql-persistentvolume` so it uses a path in your own home directory.

TODO: we need to figure out a good place to put this so it works on everyone's local machine without modification.

Then, apply all these files:

- postgresql-persistentvolume
- postgresql-persistentvolumeclaim
- postgresql-deployment
- postgresql-service

For Mac deployments, the commands are:

```
kubectl apply -n openclimate -f ./k8s/postgresql-persistentvolume.mac.yml
kubectl apply -n openclimate -f ./k8s/postgresql-persistentvolumeclaim.mac.yml
kubectl apply -n openclimate -f ./k8s/postgresql-deployment.yml
kubectl apply -n openclimate -f ./k8s/postgresql-service.yml
```
