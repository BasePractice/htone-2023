@echo off

set PWD=%CD%
set VERSION=1.13.0.1
set PATH=D:\maven\bin;%PATH%

cd .. && mvn versions:set -DnewVersion=%VERSION% && cd %PWD%
