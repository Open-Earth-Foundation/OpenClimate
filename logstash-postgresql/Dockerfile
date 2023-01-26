FROM docker.elastic.co/logstash/logstash:8.6.1

ADD https://jdbc.postgresql.org/download/postgresql-42.5.1.jar /usr/share/logstash/vendor/jar/jdbc/postgresql-42.5.1.jar

USER root
RUN chown -R logstash /usr/share/logstash/vendor/
CMD ["logstash", "-f", "/usr/share/logstash/pipeline/logstash.conf"]