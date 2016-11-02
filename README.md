# Musicalysr

Wissens- &amp; Contentmanagement Praktikum

## Using Vagrant for Development

1. Install vagrant
2. Run `vagrant plugin install vagrant-vbguest`
4. Go to vagrant directory 
5. Run vagrant up

Sobald Vagrant mit der Provisionierung der Box fertig ist, startet das Frontend (`ng serve --host 0.0.0.0`) in einer tmux Session.
Ihr könnt nun mit `vagrant ssh` in die Box und dann durch `tmux at` zum laufenden Server gelangen.
Im Browser erreicht ihr das Frontend unter [http://10.20.30.60:4200/].
In der Box laufen zur Zeit neben Node noch ein MySQL Server und ein MongoDB Server.

## Frontend

- Voraussetzungen: Node und NPM
- Angular CLI installieren
`npm install -g angular-cli`
- in das Frontend Verzeichnis wechseln
`cd frontend`
- den Server lokal starten
`ng serve`
- das Frontend im Browser öffnen
`http://localhost:4200/`
