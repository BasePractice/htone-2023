FROM quay.io/keycloak/keycloak:20.0.5
ENV PROXY_ADDRESS_FORWARDING=true
ENV DB_VENDOR=postgres

RUN mkdir -p /urm/config /urm/log; \
    echo configuration done

# Перенос сторонних зависимых модулей
COPY dependencies/modules /opt/jboss/keycloak/modules

# Перенос конфигурации
COPY dependencies/configuration/standalone-ha.xml /opt/jboss/keycloak/standalone/configuration/standalone-ha.xml

# Перенос приложения
COPY application/target/application.ear /opt/jboss/keycloak/standalone/deployments/

USER root
