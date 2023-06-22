# OpenClimate k8s Linux Setup Instructions

Package installation commands are for Arch Linux but should be easily adjustable to Debian-based systems or other distributions.

## Install dependencies
```sh
sudo pacman -Syu kubectl minikube docker
```

If you intend to manually connect to the database with psql:  
```sh
sudo pacman -Syu postgresql
```

## Setup minikube
```sh
minikube start
```

## Set default namespace
```sh
kubectl config set-context --current --namespace=openclimate
```

## Setup API and UI for local development builds
Edit `k8s/openclimate-api-deployment.yml` and `k8s/openclimate-ui-deployment.yml` and set `imagePullPolicy: Never`

## Deploy OpenClimate to the minikube cluster
```sh
./deploy.sh linux
```

## Forward ports
`kubectl -n openclimate port-forward service/openclimate-ui-service 3000:80`  
(optional, if you want to connect manually to the DB to execute queries):  
`kubectl -n openclimate port-forward service/postgresql-service 5432`

## Connect Docker to minikube
```sh
eval $(minikube -p minikube docker-env)
```

## Redeploy API
After making changes to the local codebase, run these commands to redeploy the images to k8s:
```sh
docker build api/ -t public.ecr.aws/openearthfoundation/openclimate-api
kubectl rollout restart deployment.apps/openclimate-api-deployment
```

## Redeploy UI
After making changes to the local codebase, run these commands to redeploy the images to k8s:
```sh
docker build ui/ -t public.ecr.aws/openearthfoundation/openclimate-ui
kubectl rollout restart deployment.apps/openclimate-ui-deployment
```

## Connect to the database using psql
`psql --host=localhost --port=5432 --username=development --dbname=development`

## Migration errors
If you are getting errors in the api/ migrations pods about migrations failing to run,
an entry in the `migrations` table might be missing for it.

Connect to the database as mentioned above, then add an entry like this (refer to the name of the failing migration in the api/migrations folder):  
`INSERT INTO migrations (name, run_on) VALUES ('/20230420201739-datasource-citation.js', CURRENT_DATE);`

