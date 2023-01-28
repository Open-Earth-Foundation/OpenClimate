FROM python:3-alpine

WORKDIR /opt/openclimate-import/
COPY . /opt/openclimate-import/

RUN pip install -r requirements.txt

ENV PROCESSED_DATA_DIR /data/

CMD ["python3", "/opt/openclimate-import/import_all_data.py"]