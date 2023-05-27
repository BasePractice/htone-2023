#!/usr/bin/env sh

export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
export KEYCLOAK_HOME=/opt/keycloak-12.0.4

ps aux | grep keycloak | awk '{ print $2}' | xargs kill -9
sleep 3
sh ${KEYCLOAK_HOME}/bin/standalone.sh

