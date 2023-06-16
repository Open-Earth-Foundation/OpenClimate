#!/bin/sh

set -x
set -e

export PLATFORM=$1

# Set up postgresql

kubectl -n openclimate apply -f k8s/${PLATFORM}/postgresql-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/postgresql-persistentvolumeclaim.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/local/postgresql-deployment.local.yml
kubectl -n openclimate apply -f k8s/postgresql-service.yml

# Do the migrations

kubectl -n openclimate create -f k8s/openclimate-migrations-job.yml

# Do the imports

kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-harmonize-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-harmonize-persistentvolumeclaim.${PLATFORM}.yml

kubectl -n openclimate create -f k8s/openclimate-import-job.yml

# Deploy the API

kubectl -n openclimate apply -f k8s/openclimate-api-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-api-service.yml

# Build and deploy the UI

kubectl -n openclimate apply -f k8s/openclimate-ui-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-ui-service.yml

# Deploy ElasticSearch

kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-elasticsearch-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-elasticsearch-persistentvolumeclaim.${PLATFORM}.yml

kubectl -n openclimate apply -f k8s/openclimate-elasticsearch-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-elasticsearch-service.yml

# Deploy the Ingress

kubectl -n openclimate apply -f k8s/local/openclimate-ingress.local.yml
