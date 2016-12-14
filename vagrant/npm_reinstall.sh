#!/bin/bash
# (Re-)installs node_modules in a Virtual Box compliant way 
NPM=-1
GUARD=5
COUNTER=1
rm -rf node_modules/
until [ ${NPM} -eq 0 ] || [ ${COUNTER} -gt ${GUARD} ]; do
   sudo npm i --no-bin-links
   let NPM=$?
   let COUNTER+=1
done
