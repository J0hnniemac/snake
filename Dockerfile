FROM node:latest as node
WORKDIR /app
COPY ./app .
RUN npm install
RUN npm run build --prod
#need to inject hostname to connect to

#stage 2
FROM python:3.8-slim-buster
WORKDIR /
COPY --from=node app/dist/snake app/dist/snake


COPY requirements.txt .
COPY config.py .
COPY fixIndexHTML.py .
COPY snakeBackend.py .



RUN pip install -r ./requirements.txt

ENTRYPOINT ["python", "snakeBackend.py"]

