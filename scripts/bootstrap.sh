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

NODE_VERSION=0.12.5
curl -SLO "http://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz"

# Check if 'vagrant' user exists, if so execute this
getent passwd vagrant > /dev/null 2>&1 && ret=true

if $ret
then
    # Install the rest with the vagrant user
    su vagrant

    # Fix resolve problem with git:// URLs
    git config --global url."https://".insteadOf git://
fi

# Meteor
curl https://install.meteor.com | /bin/sh

# Meteorite
npm install -g meteorite
