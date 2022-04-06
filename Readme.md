#build image
docker build -t snake .

#run container
docker run --rm -p 8080:80 snake

docker run --rm -p 8080:8080 --env-file testenv.env snake


#Local Running
##Flask
python3 -m venv venvsnake
source venvsnake/bin/activate
python3 -m  pip install -r api/requirements.txt



export FLASK_APP=api/snakeapi
flask run --host=0.0.0.0 --port=5001

##Angular



#Flask with Angular based on https://github.com/wottreng/Flask-Serving-Angular
