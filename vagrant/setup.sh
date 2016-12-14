#!/bin/bash

# Copy reinstall script to home folder
# Use it inside box to reinstall npm packages
cp /opt/dev/vagrant/npm_reinstall.sh ~/;

cd /opt/dev/frontend/
tmux new-session -d -s frontend-serve 'ng serve --host 0.0.0.0'

cd /opt/dev/backend/node-service-database/
tmux new-session -d -s backend-serve 'nodemon server.js'
