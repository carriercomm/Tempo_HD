#!/bin/sh

# This script must run with root privileges!
# Vagrant will do this automatically for provisioning.

apt-get update
apt-get upgrade

##############################
# Install common packages and useful tools
##############################

apt-get -y install curl imagemagick git python-software-properties

##############################
# Configure package repositories
##############################

apt-get update

##############################
# Install packages
##############################

# Node.js
apt-get -y install nodejs

# Install the rest with the vagrant user
su vagrant

# Fix resolve problem with git:// URLs
git config --global url."https://".insteadOf git://

# Meteor
curl https://install.meteor.com | /bin/sh

# Meteorite
npm install -g meteorite
