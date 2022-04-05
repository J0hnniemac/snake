FROM node:latest as node
WORKDIR /app
COPY ./app .
RUN npm install
RUN npm run build --prod

#stage 2
FROM python:3.8-slim-buster
WORKDIR /
COPY --from=node app/dist/snake app/dist/snake


COPY requirements.txt .
COPY config.py .
COPY fixIndexHTML.py .
COPY snakeBackend.py .
COPY start.sh .
RUN chmod +x start.sh

RUN pip install -r ./requirements.txt
#ENTRYPOINT ["python", "snakeBackend.py"]
ENTRYPOINT ["sh", "start.sh"]
