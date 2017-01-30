# Musicalysr

Wissens- &amp; Contentmanagement Praktikum

## Using Vagrant for Development

1. Install vagrant
2. Run `vagrant plugin install vagrant-vbguest`
4. Go to vagrant directory 
5. Run vagrant up

Sobald Vagrant mit der Provisionierung der Box fertig ist, startet das Frontend (`ng serve --host 0.0.0.0`) in einer tmux Session.
Ihr könnt nun mit `vagrant ssh` in die Box und dann durch `tmux at` zum laufenden Server gelangen.
Im Browser erreicht ihr das Frontend unter [http://10.20.30.40:4200/].
In der Box laufen zur Zeit neben Node noch ein MySQL Server und ein MongoDB Server.

## Workflow

1. go to vagrant directory
2. `vagrant up`
3. `vagrant fsnotify`
4. `http://10.20.30.40:4200/`
5. `vagrant halt`

## SCSS problem

1. go to frontend directory
2. `nodejs node_modules/node-sass/scripts/install.js`
3. `npm rebuild node-sass`
