#!/bin/bash

cd /opt/dev/frontend/
NPM=-1
GUARD=5
COUNTER=1
rm -rf node_modules/
until [ ${NPM} -eq 0 ] || [ ${COUNTER} -gt ${GUARD} ]; do
         sudo npm i --no-bin-links
         let NPM=$?
         let COUNTER+=1
done
tmux new-session -d -s frontend-serve 'ng serve --host 0.0.0.0'
#tmux detach -s my_session
