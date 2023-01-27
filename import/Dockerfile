FROM python:3-alpine

WORKDIR /opt/openclimate-import/
COPY . /opt/openclimate-import/

RUN pip install -r requirements.txt

ENV IMPORT_DATA_DIR /data/

CMD ["/opt/openclimate-import/import-all.sh"]