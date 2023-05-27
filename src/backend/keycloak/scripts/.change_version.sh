#!/usr/bin/env bash

export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
PWD=$(pwd)
VERSION=1.13.0.1

cd ..
mvn versions:set -DnewVersion=$VERSION
cd $PWD || exit
