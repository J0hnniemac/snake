#build image
docker build -t hsapi .

#run container
docker run --rm -p 8080:80 hsapi


#Local Running
##Flask
python3 -m venv venvsnake
source venvsnake/bin/activate
python3 -m  pip install -r api/requirements.txt



export FLASK_APP=api/snakeapi
flask run --host=0.0.0.0 --port=5001

##Angular