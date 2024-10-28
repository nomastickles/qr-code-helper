FROM node:21

ENV APP_PATH=/usr/src/app

WORKDIR $APP_PATH

RUN npm update

COPY . .

RUN yarn && yarn build:local

FROM balenalib/raspberry-pi-debian-python:latest

COPY --from=0 /usr/src/app/build/index.html ./templates/index.html
COPY --from=0 /usr/src/app/build/favicon.ico ./static/favicon.ico
COPY --from=0 /usr/src/app/build/static/css ./static/css
COPY --from=0 /usr/src/app/build/static/js ./static/js
COPY requirements.txt ./
COPY flask-start.py ./

RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./flask-start.py" ]