apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclimate-api-deployment
  labels:
    app: openclimate-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: openclimate-api
  template:
    metadata:
      labels:
        app: openclimate-api
    spec:
      containers:
      - name: openclimate-api
        image: public.ecr.aws/openearthfoundation/openclimate-api:latest
        # Set to Never for local
        imagePullPolicy: Always
        ports:
        - containerPort: 3100
        env:
        - name: NODE_ENV
          value: production
        - name: CONTROLLERPORT
          value: "3100"
        - name: AGENTADDRESS
          value: http://acapy-service:8150
        - name: WEB_ROOT
          value: https://openclimate.network
        - name: JWT_SECRET
          value: ENV_JWT_SECRET
        - name: SESSION_SECRET
          value: ENV_SESSION_SECRET
        - name: SCHEMA_VERIFIED_EMPLOYEE
          value: RSaZ64jxn2NbpH8MgBdy4C:2:Verified_Employee:1.0
        - name: POSGRES_ADDRESS
          value: ENV_POSTGRESQL_HOST
        - name: POSGRES_DB
          value: ENV_POSTGRESQL_DB
        - name: POSTGRES_USER
          value: ENV_POSTGRESQL_USER
        - name: POSGRES_PASSWORD
          value: ENV_POSTGRESQL_PASSWORD
        - name: ELASTIC_SEARCH_ENABLED
          value: "yes"
        resources:
          limits:
            memory: "1024Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/second-controller
            port: 3100
            httpHeaders:
            - name: X-Liveness-Probe
              value: "True"
          initialDelaySeconds: 5
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /api/second-controller
            port: 3100
            httpHeaders:
            - name: X-Liveness-Probe
              value: "True"
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 30
