# Vagrant Nodebox

A script to create a NodeJS environment

### Software
 - NodeJS 0.10.25
 - Apache
 - MongoDB 2.4.9
 - MySQL 5.6.16
 - Ant
 - Git
 - [Git Aware Prompt](https://github.com/jimeh/git-aware-prompt)

**NB.** This is a 64 bit install.  If you have a 32 bit system, this will not work.

# Networking

The Vagrant box is assigned the IP 10.20.30.60.  You can access all the services from this IP address.  It is a good idea to put this into [your hosts file](http://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/) for a dev URL of your project.

## NFS

This box has [NFS networking](https://docs.vagrantup.com/v2/synced-folders/nfs.html) set up on it.  This makes the box much faster.  There may be a little bit of work to get this working on your machine.

On Unix-based machines, you'll most likely need to log in as sudo

### Windows

Vagrant seems to be ignored on Windows machines.  Various blog posts say that it is possible however.

 - [http://www.jankowfsky.com/blog/2013/11/28/nfs-for-vagrant-under-windows](http://www.jankowfsky.com/blog/2013/11/28/nfs-for-vagrant-under-windows)
 - [https://coderwall.com/p/uaohzg](https://coderwall.com/p/uaohzg)
 - [FreeNFS](http://freenfs.sourceforge.net/) is also available for Windows 7

### Ubuntu

Run the following command:

    sudo apt-get install nfs-kernel-server nfs-common portmap

### Mac

This should just work on a Mac.

###Other Linux

_@todo_

# How to install

Installation should be very simple and take fewer than 15 minutes from start to finish

 1. Download and install the appropriate version of Vagrant from [VagrantUp.com](http://www.vagrantup.com/downloads.html)
 2. Install the [Vagrant Triggers](https://github.com/emyl/vagrant-triggers) plugin
 3. Install the [VBGuest](https://github.com/dotless-de/vagrant-vbguest) plugin (optional, but strongly recommended)
 4. In the root of the vagrant-nodebox project, type `vagrant up`
 5. That's it.

Once the script has finished running, you will have a complete environment for you to run your projects from.  On your local machine, you will need to put the files in the directory that contains the vagrant-nodebox folder (the `../` path, relative to thie vagrant-nodebox directory).  This folder will sync to `/opt/dev` on your Vagrant box.

# SSHing

## Linux/Mac

This is fairly simple.  In a terminal, go to your Vagrant directory and type `vagrant ssh`.  That will connect you to the Vagrant box and you can control it.  Your user is `vagrant` and you have passwordless _sudo_ access.

## Windows

This is a little more complex.  You need to download two programs for this: [PuTTY](http://the.earth.li/~sgtatham/putty/latest/x86/putty.exe) and [PuTTYgen](http://the.earth.li/~sgtatham/putty/latest/x86/puttygen.exe).  Then follow these instructions:

1. Go to your Vagrant directory and type `vagrant ssh`.  This will give you the connection details.
2. In PuTTYgen, go to _Conversions > Import key_ and import the file given above.
3. Click `Generate`.  In order to generate randomness, you will need to move your mouse around the screen.
4. Click `Save private key` and store it in the same directory as given in _Step 1_.
5. In PuTTY, create your login.  Your connection details were given in _Step 1_.  To save your private file, go to _SSH > Auth > Private key file for authentication_.
6. Connect to your Vagrant box.  Your username and password are both `vagrant`.
