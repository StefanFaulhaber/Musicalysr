#!/bin/sh

# This is the main script for provisioning.  Out of this
# file, everything that builds the box is executed.

### Software ###
# NodeJS 4.4.5
# MongoDB 3.2.7
# MySQL
# Git


### Build the box


# Make /opt directory owned by vagrant user
sudo chown vagrant:vagrant /opt/

### Update the system
sudo apt-get update


echo mysql-server mysql-server/root_password password password | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password password | sudo debconf-set-selections


### Install system dependencies
sudo apt-get install -y build-essential curl g++ libaio1 libaio-dev nfs-common openssl mysql-server software-properties-common python-software-properties


### NodeJS ###
## Get latest git
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install -y git 
## Get latest node & npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
## Globally install angular-cli
sudo npm install -g angular-cli


### Node 4.4.5
# Download the binary
#wget http://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-x64.tar.gz -O /tmp/node-v4.4.5-linux-x64.tar.gz

# Unpack it
#cd /tmp
#tar -zxvf /tmp/node-v4.4.5-linux-x64.tar.gz
#mv /tmp/node-v4.4.5-linux-x64 /opt/node-v4.4.5-linux-x64
#ln -s /opt/node-v4.4.5-linux-x64 /opt/nodejs

# Set the node_path
#export NODE_PATH=/opt/nodejs/lib/node_modules
#export NODE_PATH=$NODE_PATH:/opt/dev/node_modules
#export NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules
#export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

# Install global Node dependencies
#/opt/nodejs/bin/npm install -g n

#/opt/nodejs/bin/npm config set loglevel http


### MongoDB ###


# Download it
wget http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.7.tgz -O /tmp/mongodb-linux-x86_64-3.2.7.tgz

# Create mongo user and group
sudo groupadd -g 550 mongodb
sudo useradd -g mongodb -u 550 -c "MongoDB Database Server" -M -s /sbin/nologin mongodb

# Unpack it and move to /opt directory
cd /tmp
tar -zxvf mongodb-linux-x86_64-3.2.7.tgz
mv /tmp/mongodb-linux-x86_64-3.2.7 /opt
ln -s /opt/mongodb-linux-x86_64-3.2.7 /opt/mongodb

# Create the directories
mkdir -p /opt/mongodb/data
mkdir -p /opt/mongodb/etc
mkdir -p /opt/mongodb/log
mkdir -p /opt/mongodb/run

# Set permissions:
sudo chown mongodb /opt/mongodb/data
sudo chown mongodb /opt/mongodb/log
sudo chown mongodb /opt/mongodb/run

# Create the config file
printf "port = 27017\nlogpath=/opt/mongodb/log/mongodb.log\nfork = true\ndbpath=/opt/mongodb/data\npidfilepath=/opt/mongodb/run/mongodb.pid\nnojournal=true" > /opt/mongodb/etc/mongodb.conf

# Create the init.d file
printf '#!/bin/bash\n\nControls the main MongoDB server daemon "mongod"\n### END INIT INFO\n\n\npid_file="/opt/mongodb/run/mongodb.pid"\n\n\n# abort if not being ran as root\nif [ "${UID}" != "0" ] ; then\n        echo "you must be root"\n        exit 20\nfi\n\n\nstatus() {\n        # read pid file, return if file does not exist or is empty\n        if [ -f "$pid_file" ] ; then\n                read pid < "$pid_file"\n                if [ -z "${pid}" ] ; then\n                        # not running (empty pid file)\n                        return 1\n                fi\n        else\n                # not running (no pid file)\n                return 2\n        fi\n\n        # pid file exists, check if it is stale\n        if [ -d "/proc/${pid}" ]; then\n                # it is running (pid file is valid)\n                return 0\n        else\n                # not running (stale pid file)\n                return 3\n        fi\n}\n\nshow_status() {\n       # get the status\n        status\n\n        case "$?" in\n      0)\n            echo "running (pid ${pid})"\n           return 0\n          ;;\n        1)\n            echo "not running (empty pid file)"\n           return 1\n          ;;\n        2)\n            echo "not running (no pid file)"\n          return 2\n          ;;\n        3)\n            echo "not running (stale pid file)"\n           return 3\n          ;;\n        *)\n            # should never get here\n           echo "could not get status"\n           exit 10\n   esac\n}\n\nstart() {\n  # return if it is already running\n if ( status ) ; then\n      echo "already running"\n        return 1\n  fi\n\n  # start it\n    echo "Starting MongoDB"\n   sudo /bin/bash -c "/opt/mongodb/bin/mongod --quiet -f /opt/mongodb/etc/mongodb.conf run"\n}\n\nstop() {\n   # return if it is not running\n if ( ! status ) ; then\n        echo "already stopped"\n        return 1\n  fi\n\n  # stop it\n # call status again to get the pid\n    status\n    echo "Stopping MongoDB (killing ${pid})"\n  kill "${pid}"\n}\n\n\ncase "$1" in\n    status)\n       show_status\n       ;;\n    start)\n        start\n     ;;\n    stop)\n     stop\n      ;;\n    *)\n        echo $"Usage: $0 {start|stop|status}"\n     exit 100\nesac\n\nexit $?\n\n' > /opt/mongodb/etc/init-script
chmod 755 /opt/mongodb/etc/init-script
sudo ln -s /opt/mongodb/etc/init-script /etc/init.d/mongodb

# Register the init.d file
sudo update-rc.d mongodb defaults

# Start MongoDB
sudo service mongodb start


### MySQL ###



# Finish mysql installation
printf '#\n# The MySQL database server configuration file.\n#\n# You can copy this to one of:\n# - "/etc/mysql/my.cnf" to set global options,\n# - "~/.my.cnf" to set user-specific options.\n# \n# One can use all long options that the program supports.\n# Run program with --help to get a list of available options and with\n# --print-defaults to see which it would actually understand and use.\n#\n# For explanations see\n# http://dev.mysql.com/doc/mysql/en/server-system-variables.html\n\n# This will be passed to all mysql clients\n# It has been reported that passwords should be enclosed with ticks/quotes\n# escpecially if they contain "#" chars...\n# Remember to edit /etc/mysql/debian.cnf when changing the socket location.\n[client]\nport		= 3306\nsocket		= /var/run/mysqld/mysqld.sock\n\n# Here is entries for some specific programs\n# The following values assume you have at least 32M ram\n\n# This was formally known as [safe_mysqld]. Both versions are currently parsed.\n[mysqld_safe]\nsocket		= /var/run/mysqld/mysqld.sock\nnice		= 0\n\n[mysqld]\n#\n# * Basic Settings\n#\nuser		= mysql\npid-file	= /var/run/mysqld/mysqld.pid\nsocket		= /var/run/mysqld/mysqld.sock\nport		= 3306\nbasedir		= /usr\ndatadir		= /var/lib/mysql\ntmpdir		= /tmp\nlc-messages-dir	= /usr/share/mysql\nskip-external-locking\n#\n# Instead of skip-networking the default is now to listen only on\n# localhost which is more compatible and is not less secure.\n#bind-address		= 127.0.0.1\n#\n# * Fine Tuning\n#\nkey_buffer		= 16M\nmax_allowed_packet	= 16M\nthread_stack		= 192K\nthread_cache_size       = 8\n# This replaces the startup script and checks MyISAM tables if needed\n# the first time they are touched\nmyisam-recover         = BACKUP\n#max_connections        = 100\n#table_cache            = 64\n#thread_concurrency     = 10\n#\n# * Query Cache Configuration\n#\nquery_cache_limit	= 1M\nquery_cache_size        = 16M\n#\n# * Logging and Replication\n#\n# Both location gets rotated by the cronjob.\n# Be aware that this log type is a performance killer.\n# As of 5.1 you can enable the log at runtime!\n#general_log_file        = /var/log/mysql/mysql.log\n#general_log             = 1\n#\n# Error log - should be very few entries.\n#\nlog_error = /var/log/mysql/error.log\n#\n# Here you can see queries with especially long duration\n#log_slow_queries	= /var/log/mysql/mysql-slow.log\n#long_query_time = 2\n#log-queries-not-using-indexes\n#\n# The following can be used as easy to replay backup logs or for replication.\n# note: if you are setting up a replication slave, see README.Debian about\n#       other settings you may need to change.\n#server-id		= 1\n#log_bin			= /var/log/mysql/mysql-bin.log\nexpire_logs_days	= 10\nmax_binlog_size         = 100M\n#binlog_do_db		= include_database_name\n#binlog_ignore_db	= include_database_name\n#\n# * InnoDB\n#\n# InnoDB is enabled by default with a 10MB datafile in /var/lib/mysql/.\n# Read the manual for more InnoDB related options. There are many!\n#\n# * Security Features\n#\n# Read the manual, too, if you want chroot!\n# chroot = /var/lib/mysql/\n#\n# For generating SSL certificates I recommend the OpenSSL GUI "tinyca".\n#\n# ssl-ca=/etc/mysql/cacert.pem\n# ssl-cert=/etc/mysql/server-cert.pem\n# ssl-key=/etc/mysql/server-key.pem\n\n\n\n[mysqldump]\nquick\nquote-names\nmax_allowed_packet	= 16M\n\n[mysql]\n#no-auto-rehash	# faster start of mysql but no tab completition\n\n[isamchk]\nkey_buffer		= 16M\n\n#\n# * IMPORTANT: Additional settings that can override those from this file!\n#   The files must end with ".cnf", otherwise theyll be ignored.\n#\n!includedir /etc/mysql/conf.d/' > /tmp/my.cnf
sudo mv /tmp/my.cnf /etc/mysql/my.cnf
mysql -u root -ppassword -e "GRANT ALL PRIVILEGES ON *.* TO root@'%' IDENTIFIED BY 'password';"

mysql -u root -ppassword -e "FLUSH PRIVILEGES;"

sudo service mysql restart



### Add binaries to path ###


# First run the command
export PATH=$PATH:/opt/mongodb/bin:/opt/mysql/server-5.6/bin:/opt/nodejs/bin
export NODE_PATH=/opt/nodejs/lib/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules/lib/node_modules:/usr/local/lib/node_modules

# Now save to the /etc/bash.bashrc file so it works on reboot
cp /etc/bash.bashrc /tmp/bash.bashrc
printf "\n#Add binaries to path\n\nexport PATH=$PATH:/opt/mongodb/bin:/opt/mysql/server-5.6/bin:/opt/nodejs/bin\n#export NODE_PATH=/opt/nodejs/lib/node_modules\n#export NODE_PATH=$NODE_PATH:/opt/dev/node_modules\n#export NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules" > /tmp/path
cat /tmp/path >> /tmp/bash.bashrc
sudo chown root:root /tmp/bash.bashrc
sudo mv /tmp/bash.bashrc /etc/bash.bashrc


### Update the /etc/hosts file ###
printf '127.0.0.1       localhost\n127.0.1.1       debian-squeeze.caris.de debian-squeeze nodebox\n\n# The following lines are desirable for IPv6 capable hosts\n::1     ip6-localhost ip6-loopback\nfe00::0 ip6-localnet\nff00::0 ip6-mcastprefix\nff02::1 ip6-allnodes\nff02::2 ip6-allrouters' > /tmp/hosts
sudo mv /tmp/hosts /etc/hosts


### Install Git Aware Prompt ###
mkdir ~/.bash
cd ~/.bash
git clone git://github.com/jimeh/git-aware-prompt.git

printf 'export GITAWAREPROMPT=~/.bash/git-aware-prompt\nsource $GITAWAREPROMPT/main.sh\n\nexport PS1="\${debian_chroot:+(\\$debian_chroot)}\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\] \\[$txtcyn\\]\\$git_branch\\[$txtred\\]\\$git_dirty\\[$txtrst\\]\$ "' > ~/.bash_profile



### Set a message of the day ###
sudo rm /etc/motd
sudo cp /vagrant/files/motd.txt /etc/motd


### Test that everything is installed ok ###
printf "\n\n--- Running post-install checks ---\n\n"
node /vagrant/files/postInstall.js


### Finished ###
printf "\n\n--- NodeBox is now built ---\n\n"
