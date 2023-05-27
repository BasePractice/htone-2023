FROM python:3.10.11-alpine3.17
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install idna certifi psycopg2 urllib3
ENV PYTHONPATH=/app
ENTRYPOINT [ "python3" ]
