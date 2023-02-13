FROM python:3-alpine

WORKDIR /opt/openclimate-to-elasticsearch/
COPY . /opt/openclimate-to-elasticsearch/

RUN pip install -r requirements.txt

CMD ["python3", "/opt/openclimate-to-elasticsearch/openclimate_to_elasticsearch.py"]