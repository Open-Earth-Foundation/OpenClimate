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
kubectl apply -n openclimate -f ./k8s/mac/postgresql-persistentvolume.mac.yml
kubectl apply -n openclimate -f ./k8s/mac/postgresql-persistentvolumeclaim.mac.yml
kubectl apply -n openclimate -f ./k8s/local/postgresql-deployment.yml
kubectl apply -n openclimate -f ./k8s/postgresql-service.yml
```

# Running API/UI in local

First, add/uncomment 
```
imagePullPolicy: Never
```

to either openclimate-api-deployment.yml and openclimate-ui-deployment.yml (whichever one you're trying to run locally).

Then, run 
```
docker image rm public.ecr.aws/openearthfoundation/openclimate-ui
docker image rn public.ecr.aws/openearthfoundation/openclimate-api
```

to make sure you have no current version of the image running locally.

If you run
```
kubectl apply -n openclimate -f ./k8s/openclimate-ui-deployment.yml
kubectl apply -n openclimate -f ./k8s/openclimate-ui-service.yml
kubectl apply -n openclimate -f ./k8s/openclimate-api-deployment.yml
kubectl apply -n openclimate -f ./k8s/openclimate-api-service.yml
kubectl apply -n openclimate -f ./k8s/local/openclimate-ingress.local.yml
```

both should fail when you do ```kubectl get all -n openclimate```  with an "ErrImageNeverPulled".

For minikube users, you'll have to do an 
```
eval $(minikube -p minikube docker-env)
```
to point your docker environment for deployments before building to local docker. For docker desktop, that should already be the case.

Now, run
```
docker build ui/ -t public.ecr.aws/openearthfoundation/openclimate-ui
docker build api/ -t public.ecr.aws/openearthfoundation/openclimate-api
```
to build your local docker. The UI one should take around 3-4 minutes. The API should build pretty much within a minute.

Delete your running UI/API deployment and reapply changes.

Congratulations! You have a working local K8s cluster.

When you make changes you should rebuild your docker then do a 

```
kubectl rollout restart deployment.apps/openclimate-ui-deployment
kubectl rollout restart deployment.apps/openclimate-api-deployment
```

to make those changes visible.

### Helpful K8s commands

To change your default namespace so you don't have to always do -n openclimate,

```
kubectl config set-context --current --namespace=openclimate
```

To switch back to default,

```
kubectl config set-context --current --namespace=default
```

You can also change your current context if you have an EKS cluster also running.

```
kubectl config view
kubectl config use-context <context name here>
```

To delete your old replicasets:
```
kubectl delete replicaset $(kubectl get replicaset -o jsonpath='{ .items[?(@.spec.replicas==0)].metadata.name }')
```

