FROM python:3-alpine

WORKDIR /opt/openclimate-import/
COPY . /opt/openclimate-import/

RUN pip install -r requirements.txt

ENV PROCESSED_DATA_DIR /data/

CMD ["/bin/sh", "/opt/openclimate-import/import-all.sh"]