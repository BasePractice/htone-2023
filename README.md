# leaders2023
Лидеры 2023
# 
![ci workflow](https://github.com/BasePractice/leaders2023/actions/workflows/ci.yml/badge.svg?branch=main)
![kk workflow](https://github.com/BasePractice/leaders2023/actions/workflows/maven.yml/badge.svg?branch=main)

[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=code)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=blanks)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=lines)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=comments)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=cocomo)](https://github.com/BasePractice/htone-2023/)

# Deploy

## Kafka

```
# Attach to kafka's container
docker exec -it ht2023_kafka-kafka-1 /bin/bash

# Create topics
kafka-topics.sh --create --topic notifications --bootstrap-server localhost:9092

# Check existing topics
kafka-topics.sh --list --bootstrap-server localhost:9092

# Get topic's messages
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic notifications --from-beginning

```
