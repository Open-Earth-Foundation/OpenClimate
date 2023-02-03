#!/bin/sh

set -e

export PLATFORM=$1
export REPO=public.ecr.aws/openearthfoundation

# Set up postgresql

kubectl -n openclimate apply -f k8s/${PLATFORM}/postgresql-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/postgresql-persistentvolumeclaim.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/local/postgresql-deployment.local.yml
kubectl -n openclimate apply -f k8s/postgresql-service.yml

# Do the migrations

docker build -t $REPO/openclimate-api api
docker push $REPO/openclimate-api

kubectl -n openclimate create -f k8s/openclimate-migrations-job.yml

# Do the imports

docker build -t $REPO/openclimate-import import
docker push $REPO/openclimate-import

kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-harmonize-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-harmonize-persistentvolumeclaim.${PLATFORM}.yml

kubectl -n openclimate create -f k8s/openclimate-import-job.yml

# Deploy the API

kubectl -n openclimate apply -f k8s/openclimate-api-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-api-service.yml

# Build and deploy the UI

docker build -t $REPO/openclimate-ui ui
docker push $REPO/openclimate-ui

kubectl -n openclimate apply -f k8s/openclimate-ui-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-ui-service.yml

# Deploy ElasticSearch

kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-elasticsearch-persistentvolume.${PLATFORM}.yml
kubectl -n openclimate apply -f k8s/${PLATFORM}/openclimate-elasticsearch-persistentvolumeclaim.${PLATFORM}.yml

kubectl -n openclimate apply -f k8s/openclimate-elasticsearch-deployment.yml
kubectl -n openclimate apply -f k8s/openclimate-elasticsearch-service.yml

# Build and deploy logstash

docker build -t $REPO/logstash-postgresql logstash-postgresql
docker push $REPO/logstash-postgresql

kubectl -n openclimate apply -f k8s/logstash-configmap.yml
kubectl -n openclimate apply -f k8s/logstash-deployment.yml

# Deploy Kibana

kubectl -n openclimate apply -f k8s/kibana-deployment.yml
kubectl -n openclimate apply -f k8s/kibana-service.yml

# Deploy the Ingress

kubectl -n openclimate apply -f k8s/local/openclimate-ingress.local.yml
