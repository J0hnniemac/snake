#!/bin/bash

cd /app/dist/snake
MAINFILE=$(ls main*)
echo "MAINFILE " $MAINFILE
echo "BASEURL" $BASEURL
echo "BASEPORT" $BASEPORT
echo "CURRENTURL" $CURRENTURL
echo "CURRENTPORT" $ CURRENTPORT

sed -i "s~$CURRENTURL~$BASEURL~g" $MAINFILE
cd /
python snakeBackend.py




