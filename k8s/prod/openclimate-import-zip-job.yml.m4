# openclimate-import-zip-job.yml
# Runs a single task that imports all the processed harmonized data in the develop
# branch by downloading it from GitHub. Kind of crazy but it just might work.
# It should work on both remote and local.
apiVersion: batch/v1
kind: Job
metadata:
  generateName: openclimate-import-zip-
spec:
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      containers:
      - name: openclimate-import
        image: public.ecr.aws/openearthfoundation/openclimate-import:stable
        env:
          - name: OPENCLIMATE_DATABASE
            value: ENV_POSTGRESQL_DB
          - name: OPENCLIMATE_HOST
            value: ENV_POSTGRESQL_HOST
          - name: OPENCLIMATE_USER
            value: ENV_POSTGRESQL_USER
          - name: OPENCLIMATE_PASSWORD
            value: ENV_POSTGRESQL_PASSWORD
          - name: ZIP_FILE_URL
            value: https://github.com/Open-Earth-Foundation/OpenClimate/archive/refs/heads/main.zip
          - name: PROCESSED_DATA_DIR
            value: OpenClimate-main/harmonize/data/processed/
      restartPolicy: OnFailure
  backoffLimit: 4