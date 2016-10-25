# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # Specify base box to use
  config.vm.box = "http://files.vagrantup.com/precise64.box"
  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 4200 on the guest machine.
  config.vm.network "forwarded_port", guest: 4200, host: 8080 
  # Setting the amount of memory to allocate to VM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end
  # Provision machine with following scripts
  config.vm.provision "shell", path: "vagrant/setup.sh"
  config.vm.provision "shell", path: "vagrant/bootstrap.sh", run: "always"
end
