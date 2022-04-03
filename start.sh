#!/bin/bash
export FLASK_APP=api/snakeapi
nginx && flask run --host=0.0.0.0  
