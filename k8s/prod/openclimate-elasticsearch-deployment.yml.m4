apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclimate-elasticsearch-deployment
  labels:
    app: openclimate-elasticsearch
spec:
  replicas: 1
  selector:
    matchLabels:
      app: openclimate-elasticsearch
  template:
    metadata:
      labels:
        app: openclimate-elasticsearch
    spec:
      volumes:
        - name: openclimate-elasticsearch-data
          persistentVolumeClaim:
            claimName: openclimate-elasticsearch-persistentvolumeclaim
      initContainers:
        - name: take-data-dir-ownership
          image: alpine:3
          command:
          - chown
          - -R
          - 1000:0
          - /usr/share/elasticsearch/data
          volumeMounts:
            - mountPath: "/usr/share/elasticsearch/data"
              name: openclimate-elasticsearch-data
      containers:
        - name: openclimate-elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:8.6.2
          imagePullPolicy: Always
          ports:
            - containerPort: 9200
          env:
            - name: node.name
              value: oces01
            - name: ELASTIC_PASSWORD
              value: ENV_ELASTIC_PASSWORD
            - name: xpack.security.enabled
              value: "false"
            - name: cluster.name
              value: oces
            - name: discovery.type
              value: single-node
          resources:
            limits:
              memory: "1024Mi"
              cpu: "1000m"
          volumeMounts:
            - mountPath: "/usr/share/elasticsearch/data"
              name: openclimate-elasticsearch-data
