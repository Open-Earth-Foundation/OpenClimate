apiVersion: batch/v1
kind: Job
metadata:
  generateName: openclimate-to-elasticsearch-
spec:
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      containers:
      - name: openclimate-to-elasticsearch
        image: public.ecr.aws/openearthfoundation/openclimate-to-elasticsearch:stable
        env:
          - name: OPENCLIMATE_DATABASE
            value: ENV_POSTGRESQL_DB
          - name: OPENCLIMATE_HOST
            value: ENV_POSTGRESQL_HOST
          - name: OPENCLIMATE_USER
            value: ENV_POSTGRESQL_USER
          - name: OPENCLIMATE_PASSWORD
            value: ENV_POSTGRESQL_PASSWORD
          - name: OPENCLIMATE_ES_NODE
            value: "http://openclimate-elasticsearch-service:9200/"
          - name: OPENCLIMATE_ES_INDEX
            value: actors
          - name: OPENCLIMATE_ES_USER
            value: "elastic"
          - name: OPENCLIMATE_ES_PASSWORD
            value: ENV_ELASTIC_PASSWORD
      restartPolicy: OnFailure
  backoffLimit: 4