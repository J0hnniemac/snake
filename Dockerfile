FROM node:latest as node
WORKDIR /app
COPY ang/snake .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/snake /usr/share/nginx/html

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /app

COPY api/requirements.txt api/snakeapi.py . .
COPY start.sh .
RUN chmod +x start.sh

RUN pip install -r ./requirements.txt

ENTRYPOINT ["sh", "./start.sh"]
