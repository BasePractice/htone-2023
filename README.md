# ЛИДЕРЫ ЦИФРОВОЙ ТРАНСФОРМАЦИИ 2023 г.

![ci workflow](https://github.com/BasePractice/leaders2023/actions/workflows/ci.yml/badge.svg?branch=main)
![kk workflow](https://github.com/BasePractice/leaders2023/actions/workflows/maven.yml/badge.svg?branch=main)

[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=code)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=blanks)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=lines)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=comments)](https://github.com/BasePractice/htone-2023/)
[![Scc Count Badge](https://sloc.xyz/github/BasePractice/htone-2023/?category=cocomo)](https://github.com/BasePractice/htone-2023/)

# Решаемая задача

№1 [АГРЕГАТОР ПЛОЩАДОК И УСЛУГ КРЕАТИВНЫХ ИНДУСТРИЙ МОСКВЫ](https://leaders2023.innoagency.ru/task_1)

## АКТУАЛЬНОСТЬ
Агентство креативных индустрий является единым окном для взаимодействия органов власти и представителей креативного предпринимательства Москвы.

На данный момент не существует единой платформы для бронирования креативных площадок и услуг (креативные кластеры, звукозаписывающие студии, галереи, киноплощадки для проведения съемок и кинотеатры для проведения показов и фестивалей и проч.), поэтому приходится искать данные о них из различных источников, что осложняет процесс как для горожан и бизнес-сообщества, так и для арендодателей и креативных площадок.

Создание единого онлайн сервиса бронирования могло бы решить данную проблему.

Платформа позволит удовлетворить запросы горожан и бизнес-сообщества для организации тематического креативного досуга и оптимизации рабочего процесса

## ОПИСАНИЕ ЗАДАЧИ
Разработайте сервис, который позволит горожанам и бизнес-сообществу бронировать креативные площадки Москвы, а собственникам вносить данные о площадках в формате презентации и заключать электронные договоры онлайн

# Команда

- Ирина Блажина (  )
- Семен Сеначин
- Дмитрий Климов
- Павел Попов
- Андрей Хлебников ( [GitHub](https://github.com/Pastor) ) 

# Результаты

Вышли в финал. Призовых мест не заняли.

[ПРЕЗЕНТАЦИЯ](docs/Презентация%20Sigma%20100623_v1_2.pptx)

[ДОКУМЕНТАЦИЯ](docs/Документация%2001.АКИ_Sigma%20v1.docx)

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
